import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const EnergyContext = createContext(null);

const STORAGE_KEY = "energyLogs";

export function EnergyProvider({ children }) {
  const [logs, setLogs] = useLocalStorage(STORAGE_KEY, []);

  const addLog = (level, meta = {}) => {
    const newLog = {
      id: crypto.randomUUID(),
      level,
      createdAt: Date.now(),
      ...meta
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const deleteLog = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const deleteLogsBySessionId = (sessionId) => {
    const sessionIdStr = String(sessionId);
    setLogs((prev) => prev.filter((log) => String(log.sessionId) !== sessionIdStr));
  }

  const value = useMemo(() => ({ logs, addLog, deleteLog, deleteLogsBySessionId }), [logs]);

  return (
    <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>
  );
}

export function useEnergy() {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be inside Energy Provider");
  return ctx;
}
