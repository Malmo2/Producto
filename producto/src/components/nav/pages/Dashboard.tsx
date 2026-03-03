import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaBolt, FaChartBar } from "react-icons/fa";
import { Box, Typography } from "../../ui";
import { useAuthState } from "../../../contexts/AuthContext";
import { useSessions } from "../../../contexts/SessionContext";
import { useEnergy } from "../../energy/context/EnergyContext";
import { apiFetch } from "../../../lib/api";
import { formatDurationMinutes, getTodayDateString } from "../../../utils/formatTime";
import DashboardLayout from "../../layout/DashboardLayout";
import Header from "../../panels/Header";
import SmartRecommendation from "../../smartRecommendation/SmartRecommendation";
import styles from "./Dashboard.module.css";

import StatCard from "../../ui/StatCard";
import BaseStatCard from "../../ui/BaseStatCard";
import QuickActionCard from "../../ui/QuickCardAction";

const normalize = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ");

const isDeepWork = (category: unknown) => {
  const c = normalize(category);
  return c === "deepwork" || c === "deep work" || c.includes("deep work");
};

function Dashboard() {
  const { token } = useAuthState();
  const navigate = useNavigate();
  const { sessions } = useSessions();
  const { logs } = useEnergy();
  const today = getTodayDateString();

  const { timeTracked, sessionCount, avgEnergy, deepWorkSeconds } = useMemo(() => {
    const sessionList = Array.isArray(sessions) ? sessions : [];
    const todaySessions = sessionList.filter((s: { date?: string; startTime: number | string }) => {
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
        return isDeepWork(s.category) ? acc + (s.duration ?? 0) : acc;
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

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/me").catch((e) => console.error("API error:", e));
  }, [token]);

  return (
    <Box className={`${styles.dashboardRoot} page-shell`}>
      <Header />
      <Box className="page-content">
        <DashboardLayout>
          <Box className={styles.dashboardSections}>
            <Box>
              <Typography variant="h6" className={styles.sectionTitle}>
              </Typography>

              <BaseStatCard>
                <Box className={`productivity-snapshot ${styles.productivitySnapshotGrid}`}>
                  <StatCard label="Time Tracked" value={formatDurationMinutes(timeTracked)} />
                  <StatCard label="Sessions" value={String(sessionCount)} />
                  <StatCard
                    label="Avg Energy"
                    value={avgEnergy != null ? `${avgEnergy.toFixed(1)}` : "—"}
                  />
                  <StatCard label="Deep Work" value={formatDurationMinutes(deepWorkSeconds)} />
                </Box>
              </BaseStatCard>
            </Box>

            <Box>
              <Box className={styles.smartRecommendationHeader}>
                <Typography variant="h6" className={styles.sectionTitleNoMargin}>
                </Typography>
              </Box>
              <SmartRecommendation />
            </Box>

            <Box>
              <Typography variant="h6" className={styles.sectionTitle}>
              </Typography>

              <BaseStatCard>
                <Box className={`quick-actions-container ${styles.quickActionsGrid}`}>
                  <QuickActionCard
                    icon={FaClock}
                    title="Start Timer"
                    subtitle="Begin a focus session"
                    onClick={() => navigate("/timer")}
                  />
                  <QuickActionCard
                    icon={FaBolt}
                    title="Log Energy"
                    subtitle="Record how you feel"
                    onClick={() => navigate("/energy")}
                  />
                  <QuickActionCard
                    icon={FaChartBar}
                    title="View Insights"
                    subtitle="Check your analytics"
                    onClick={() => navigate("/insights")}
                  />
                </Box>
              </BaseStatCard>
            </Box>
          </Box>
        </DashboardLayout>
      </Box>
    </Box>
  );
}

export default Dashboard;