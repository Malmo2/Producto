import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    return saved ? JSON.parse(saved) : []; // Load sessions from localStorage if available, otherwise start with an empty array
  });
  // Loading sessions from localStorage when the component starts
  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);
  // Add a new session to the list
  const addSession = (session) => {
    setSessions([...sessions, session]);
  };
  // Delete a session by its ID
  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
  };

  // Clear all sessions and remove from localStorage
  const clearSessions = () => {
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  const value = {
    //value object to be passed to provider
    sessions,
    addSession,
    deleteSession,
    clearSessions,
  };

  return (
    //providing value to all children components
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider> //wrapping children with session provider to provide access to session context
  );
}
// creates a hook for components
export function useSessions() {
  const context = useContext(SessionContext); //fetching value from sessioncontext
  if (!context) {
    throw new Error("useSessions must be used within SessionProvider");
  }
  return context; //return all value objects
}
