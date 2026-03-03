import { useMemo, useState } from "react";
import { Box, Typography } from "../../ui";
import { useSessions } from "../../../contexts/SessionContext";
import { useEnergy } from "../../energy/context/EnergyContext";
import { formatDurationMinutes, getTodayDateString } from "../../../utils/formatTime";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

  const { sessions: rawSessions, deleteSession, clearSessions } = useSessions() as {
    sessions: WorkSessions[];
    deleteSession: (id: string | number) => void;
    clearSessions: () => void;
  };
  const { logs: rawLogs } = useEnergy() as { logs: Array<{ createdAt?: string | number; level?: number }> };
  const sessions = Array.isArray(rawSessions) ? rawSessions : [];
  const logs = Array.isArray(rawLogs) ? rawLogs : [];
  const today = getTodayDateString();
  const chartColors = ["#60A5FA", "#34D399", "#A78BFA", "#F59E0B", "#F87171", "#22D3EE"];

  const toISODate = (value: string | number | Date | undefined) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  };

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

    const todayLogs = logs.filter((log: { createdAt?: string | number }) => {
      if (!log.createdAt) return false;
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

  const dailyFocusData = useMemo(() => {
    const map = new Map<string, number>();

    sessions.forEach((session: { date?: string; startTime?: string | number; duration?: number }) => {
      const dateKey = session.date ?? toISODate(session.startTime);
      if (!dateKey) return;
      map.set(dateKey, (map.get(dateKey) ?? 0) + (session.duration ?? 0));
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, duration]) => ({
        date,
        focusMinutes: Math.round(duration / 60),
      }));
  }, [sessions]);

  const categoryData = useMemo(() => {
    const map = new Map<string, { durationSeconds: number; sessionsCount: number }>();

    sessions.forEach((session: { category?: string; duration?: number }) => {
      const category = session.category?.trim() || "Uncategorized";
      const current = map.get(category) ?? { durationSeconds: 0, sessionsCount: 0 };
      map.set(category, {
        durationSeconds: current.durationSeconds + (session.duration ?? 0),
        sessionsCount: current.sessionsCount + 1,
      });
    });

    return Array.from(map.entries())
      .map(([category, value]) => ({
        category,
        focusMinutes: Math.round(value.durationSeconds / 60),
        sessionsCount: value.sessionsCount,
      }))
      .sort((a, b) => b.focusMinutes - a.focusMinutes);
  }, [sessions]);

  const categoryPieData = useMemo(
    () => categoryData.map((item) => ({ name: item.category, value: item.focusMinutes })),
    [categoryData]
  );

  const energyVsFocusData = useMemo(() => {
    const focusMap = new Map<string, number>();
    const energyMap = new Map<string, { total: number; count: number }>();

    sessions.forEach((session: { date?: string; startTime?: string | number; duration?: number }) => {
      const dateKey = session.date ?? toISODate(session.startTime);
      if (!dateKey) return;
      focusMap.set(dateKey, (focusMap.get(dateKey) ?? 0) + (session.duration ?? 0));
    });

    logs.forEach((log: { createdAt?: string | number; level?: number }) => {
      const dateKey = toISODate(log.createdAt);
      if (!dateKey) return;
      const current = energyMap.get(dateKey) ?? { total: 0, count: 0 };
      energyMap.set(dateKey, {
        total: current.total + (log.level ?? 0),
        count: current.count + 1,
      });
    });

    const allDates = Array.from(new Set([...focusMap.keys(), ...energyMap.keys()])).sort((a, b) =>
      a.localeCompare(b)
    );

    return allDates.slice(-14).map((date) => {
      const energy = energyMap.get(date);
      return {
        date,
        focusMinutes: Math.round((focusMap.get(date) ?? 0) / 60),
        avgEnergy: energy ? Number((energy.total / energy.count).toFixed(2)) : null,
      };
    });
  }, [sessions, logs]);

  return (
    <Box className="page-shell">
      <Header />

      <Box className={`page-content ${styles.insightsContent}`}>
        <Box className={styles.tabRow}>
          <TabButton active={tab === "snapshot"} label="Snapshot" onClick={() => setTab("snapshot")} />
          <TabButton active={tab === "sessions"} label="Sessions" onClick={() => setTab("sessions")} />
        </Box>

        {tab === "snapshot" ? (
          <Box className={styles.snapshotSection}>
            <Typography variant="h6" className={styles.snapshotTitle}>
              Productivity Snapshot
            </Typography>

            <Box
              className={`productivity-snapshot ${styles.snapshotGridCard}`}
            >
              <StatCard label="Time Tracked" value={formatDurationMinutes(timeTracked)} />
              <StatCard label="Sessions" value={String(sessionCount)} />
              <StatCard label="Avg Energy" value={avgEnergy != null ? `${avgEnergy.toFixed(1)}` : "—"} />
              <StatCard label="Deep Work" value={formatDurationMinutes(deepWorkSeconds)} />
            </Box>

            <Box className={styles.chartsGrid}>
              <Box className={styles.chartCard}>
                <Typography variant="body1" className={styles.chartTitle}>
                  Focus Time by Day
                </Typography>
                {dailyFocusData.length > 0 ? (
                  <Box className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyFocusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="focusMinutes" stroke="#60A5FA" strokeWidth={2} dot />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography className={styles.chartEmpty}>No session data available yet.</Typography>
                )}
              </Box>

              <Box className={styles.chartCard}>
                <Typography variant="body1" className={styles.chartTitle}>
                  Sessions by Category
                </Typography>
                {categoryData.length > 0 ? (
                  <Box className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="category" tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="sessionsCount" fill="#34D399" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography className={styles.chartEmpty}>No category breakdown yet.</Typography>
                )}
              </Box>

              <Box className={styles.chartCard}>
                <Typography variant="body1" className={styles.chartTitle}>
                  Category Time Share
                </Typography>
                {categoryPieData.length > 0 ? (
                  <Box className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`pie-segment-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography className={styles.chartEmpty}>No time-share data yet.</Typography>
                )}
              </Box>

              <Box className={styles.chartCard}>
                <Typography variant="body1" className={styles.chartTitle}>
                  Energy vs Focus
                </Typography>
                {energyVsFocusData.length > 0 ? (
                  <Box className={styles.chartBody}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={energyVsFocusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fill: "#CBD5E1", fontSize: 11 }} />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[1, 5]}
                          tick={{ fill: "#CBD5E1", fontSize: 11 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="focusMinutes" name="Focus Minutes" fill="#60A5FA" />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgEnergy"
                          name="Avg Energy"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          dot
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography className={styles.chartEmpty}>Add sessions or energy logs to unlock this chart.</Typography>
                )}
              </Box>
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