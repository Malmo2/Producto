import { createContext, useContext, useState, useEffect } from "react";
import { useEnergy } from "../components/energy/context/EnergyContext";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("timerSessions");
    return saved ? JSON.parse(saved) : [];
  });

  const { deleteLogsBySessionId } = useEnergy();

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions([...sessions, session]);
  };

  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter((s) => String(s.id) !== String(sessionId));
    deleteLogsBySessionId?.(String(sessionId));
    setSessions(updatedSessions);
  };

  const clearSessions = () => {
    sessions.forEach((s) => deleteLogsBySessionId?.(String(s.id)));
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  const value = {
    sessions,
    addSession,
    deleteSession,
    clearSessions,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessions must be used within SessionProvider");
  }
  return context;
}
