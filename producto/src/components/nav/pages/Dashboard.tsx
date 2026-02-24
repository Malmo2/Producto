import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaBolt, FaChartBar } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { Box, Card, CardContent, Typography } from "../../ui";
import { useAuthState } from "../../../contexts/AuthContext";
import { useSessions } from "../../../contexts/SessionContext";
import { useEnergy } from "../../energy/context/EnergyContext";
import { apiFetch } from "../../../lib/api";
import { formatDurationMinutes, getTodayDateString } from "../../../utils/formatTime";
import DashboardLayout from "../../layout/DashboardLayout";
import Header from "../../panels/Header";
import SmartRecommendation from "../../smartRecommendation/SmartRecommendation";

const statCardBase = {
  borderRadius: "12px",
  padding: "20px",
  height: "100%",
  minHeight: 120,
};

function StatCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <Card
      style={{
        ...statCardBase,
        backgroundColor: highlighted ? "#1E6FE3" : "#121A2B",
        borderRadius: highlighted ? "18px" : "12px",
        boxShadow: highlighted ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
        border: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {highlighted && (
        <Box
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaBolt size={14} />
        </Box>
      )}
      <Typography
        variant="body2"
        style={{
          color: highlighted ? "#000" : "#A0A0A0",
          marginBottom: 8,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h2"
        style={{
          color: highlighted ? "#000" : "#FFFFFF",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Card>
  );
}

function QuickActionCard({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="quick-action-card ui-card"
      onClick={onClick}
      style={{
        ...statCardBase,
        backgroundColor: "#121A2B",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "background-color 0.2s, color 0.2s, box-shadow 0.2s",
      }}
    >
      <Box style={{ fontSize: 28, color: "#A0A0A0", flexShrink: 0 }}>
        <Icon size={28} />
      </Box>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" style={{ color: "#FFFFFF", marginBottom: 4 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="muted">
          {subtitle}
        </Typography>
      </Box>
      <Box style={{ color: "#A0A0A0", flexShrink: 0 }}>
        <IoChevronForward size={20} />
      </Box>
    </button>
  );
}

function Dashboard() {
  const { token } = useAuthState();
  const navigate = useNavigate();
  const { sessions } = useSessions();
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
    return {
      timeTracked,
      sessionCount,
      avgEnergy,
      deepWorkSeconds,
    };
  }, [sessions, logs, today]);

  useEffect(() => {
    if (!token) return;
    apiFetch("/api/me").catch((e) => console.error("API error:", e));
  }, [token]);

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <Header />
      <DashboardLayout>
        <Box style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
          <Box>
            <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 16 }}>
              Quick Actions
            </Typography>
            <Box
              className="quick-actions-container"
              style={{
                backgroundColor: "#0d0f1d",
                borderRadius: 12,
                padding: 20,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
            >
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
          </Box>
          <SmartRecommendation />
        </Box>
      </DashboardLayout>
    </Box>
  );
}

export default Dashboard;
