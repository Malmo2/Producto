import { createContext, useContext, useState, useEffect } from "react";
import { useEnergy } from "../components/energy/context/EnergyContext";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem("timerSessions");
      if (!saved || saved === "undefined" || saved === "null") return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem("timerSessions");
      return [];
    }
  });

  const { deleteLogsBySessionId } = useEnergy();

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions((prev) => [...prev, session]);
  };

  const deleteSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => String(s.id) !== String(sessionId)));
    deleteLogsBySessionId?.(String(sessionId));
  };

  const clearSessions = () => {
    sessions.forEach((s) => deleteLogsBySessionId?.(String(s.id)));
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, deleteSession, clearSessions }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSessions must be used within SessionProvider");
  return context;
}