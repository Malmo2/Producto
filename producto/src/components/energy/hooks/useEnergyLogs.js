import { useEffect, useState } from "react";

const STORAGE_KEY = "energyLogs";

const readLogs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function useEnergyLogs() {
  const [logs, setLogs] = useState(() => readLogs());

  useEffect(() => {
    function handleUpdate() {
      setLogs(readLogs());
    }

    window.addEventListener("energyLogsUpdated", handleUpdate);

    // optional bonus: if logs change in another tab
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("energyLogsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return logs;
}

export default useEnergyLogs;
