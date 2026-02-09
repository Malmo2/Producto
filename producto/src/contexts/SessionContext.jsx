import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState(() => {
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);
}
