import React, { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type EnergyLog = {
  id: string;
  level: number;
  createdAt: number;
  sessionId?: string | number;
  [key: string]: unknown;
};

type EnergyContextValue = {
  logs: EnergyLog[];
  addLog: (level: number, meta?: Record<string, unknown>) => void;
  deleteLog: (id: string) => void;
  deleteLogsBySessionId: (sessionId: string | number) => void;
};

const STORAGE_KEY = "energyLogs";

const EnergyContext = createContext<EnergyContextValue | null>(null);

export function EnergyProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useLocalStorage<EnergyLog[]>(STORAGE_KEY, []);

  const addLog: EnergyContextValue["addLog"] = (level, meta = {}) => {
    const newLog: EnergyLog = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      level,
      createdAt: Date.now(),
      ...meta,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const deleteLog: EnergyContextValue["deleteLog"] = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const deleteLogsBySessionId: EnergyContextValue["deleteLogsBySessionId"] = (sessionId) => {
    const sessionIdStr = String(sessionId);
    setLogs((prev) => prev.filter((log) => String(log.sessionId) !== sessionIdStr));
  };

  const value = useMemo<EnergyContextValue>(
    () => ({ logs, addLog, deleteLog, deleteLogsBySessionId }),
    [logs]
  );

  return <EnergyContext.Provider value={value}>{children}</EnergyContext.Provider>;
}

export function useEnergy(): EnergyContextValue {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be inside Energy Provider");
  return ctx;
}