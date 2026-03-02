import { useMemo, useState } from "react";
import { Box, Typography } from "../../ui";
import { useSessions } from "../../../contexts/SessionContext";
import { useEnergy } from "../../energy/context/EnergyContext";
import { formatDurationMinutes, getTodayDateString } from "../../../utils/formatTime";
import Header from "../../panels/Header";
import { TabButton } from "../../ui/TabButton";
import StatCard from "../../ui/StatCard";

import type { WorkSessions } from "../../sessions/types";
import styles from "./Sessions.module.css";

import SessionsHeader from "../../sessions/SessionsHeader";
import SessionsToolbar from "../../sessions/SessionsToolbar";
import SessionsEmptyState from "../../sessions/SessionsEmptyState";
import SessionsList from "../../sessions/SessionsList";

import { useFilteredSessions } from "../../../hooks/useFilteredSessions";
import { useCategories } from "../../../hooks/useCategories";

function Insights() {
  const [tab, setTab] = useState<"snapshot" | "sessions">("snapshot");

  const { sessions, deleteSession, clearSessions } = useSessions();
  const { logs } = useEnergy();
  const today = getTodayDateString();

  const { timeTracked, sessionCount, avgEnergy, deepWorkSeconds } = useMemo(() => {
    const todaySessions = sessions.filter((s: { date?: string; startTime: number | string }) => {
      const d = s.date ?? new Date(s.startTime).toISOString().slice(0, 10);
      return d === today;
    });

    const timeTracked = todaySessions.reduce(
      (acc: number, s: { duration?: number }) => acc + (s.duration ?? 0),
      0
    );

    const sessionCount = todaySessions.length;

    const deepWorkSeconds = todaySessions.reduce(
      (acc: number, s: { category?: string; duration?: number }) => {
        const cat = (s.category ?? "").toLowerCase();
        if (cat.includes("deep work") || cat.includes("deepwork")) return acc + (s.duration ?? 0);
        return acc;
      },
      0
    );

    const energyLogs = Array.isArray(logs) ? logs : [];
    const todayLogs = energyLogs.filter((log: { createdAt: number }) => {
      const d = new Date(log.createdAt).toISOString().slice(0, 10);
      return d === today;
    });

    const avgEnergy =
      todayLogs.length > 0
        ? todayLogs.reduce((acc: number, l: { level?: number }) => acc + (l.level ?? 0), 0) /
        todayLogs.length
        : null;

    return { timeTracked, sessionCount, avgEnergy, deepWorkSeconds };
  }, [sessions, logs, today]);

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const categories = useCategories(sessions);
  const filteredSessions = useFilteredSessions(sessions, categoryFilter, sortOrder);

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Header />

      <Box style={{ display: "flex", flexDirection: "column", gap: 20, padding: 20 }}>
        <Box style={{ display: "flex", gap: 10 }}>
          <TabButton active={tab === "snapshot"} label="Snapshot" onClick={() => setTab("snapshot")} />
          <TabButton active={tab === "sessions"} label="Sessions" onClick={() => setTab("sessions")} />
        </Box>

        {tab === "snapshot" ? (
          <Box>
            <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 16 }}>
              Productivity Snapshot
            </Typography>

            <Box
              className="productivity-snapshot"
              style={{
                backgroundColor: "#121A2B",
                borderRadius: 12,
                padding: 20,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
              }}
            >
              <StatCard label="Time Tracked" value={formatDurationMinutes(timeTracked)} />
              <StatCard label="Sessions" value={String(sessionCount)} />
              <StatCard label="Avg Energy" value={avgEnergy != null ? `${avgEnergy.toFixed(1)}` : "—"} />
              <StatCard label="Deep Work" value={formatDurationMinutes(deepWorkSeconds)} />
            </Box>
          </Box>
        ) : (
          <Box className={styles.page}>
            <SessionsHeader onClearAll={clearSessions} disableClearAll={sessions.length === 0} />

            <SessionsToolbar
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              count={filteredSessions.length}
            />

            {sessions.length === 0 ? (
              <SessionsEmptyState />
            ) : (
              <SessionsList sessions={filteredSessions as WorkSessions[]} onDelete={deleteSession} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Insights;