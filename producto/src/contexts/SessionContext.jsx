import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions([...sessions, session]);
  };

  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
  };

  const clearSessions = () => {
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
