import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useEnergy } from "../components/energy/context/EnergyContext";

export type SessionCategory = "Deep Work" | "Meeting" | "Testing" | "On break" | "Other";

export type TimerSession = {
  id: string;
  title: string;
  category: SessionCategory;
  startTime: Date | string | null;
  endTime: Date | string;
  duration: number;
  date: string;
  energy: number;
};

type SessionContextValue = {
  sessions: TimerSession[];
  addSession: (session: TimerSession) => void;
  deleteSession: (sessionId: string) => void;
  clearSessions: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function isTimerSessionArray(value: unknown): value is TimerSession[] {
  return Array.isArray(value);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<TimerSession[]>(() => {
    try {
      const saved = localStorage.getItem("timerSessions");
      if (!saved || saved === "undefined" || saved === "null") return [];
      const parsed: unknown = JSON.parse(saved);
      return isTimerSessionArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem("timerSessions");
      return [];
    }
  });

  const { deleteLogsBySessionId } = useEnergy();

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession: SessionContextValue["addSession"] = (session) => {
    setSessions((prev) => [...prev, session]);
  };

  const deleteSession: SessionContextValue["deleteSession"] = (sessionId) => {
    setSessions((prev) => prev.filter((s) => String(s.id) !== String(sessionId)));
    deleteLogsBySessionId(String(sessionId));
  };

  const clearSessions: SessionContextValue["clearSessions"] = () => {
    sessions.forEach((s) => deleteLogsBySessionId(String(s.id)));
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  const value = useMemo<SessionContextValue>(
    () => ({ sessions, addSession, deleteSession, clearSessions }),
    [sessions]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessions(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSessions must be used within SessionProvider");
  return context;
}