import { useMemo } from "react";
import { FaClock } from "react-icons/fa";
import { Box, Card, CardContent, Typography } from "../ui";
import { useSessions } from "../../contexts/SessionContext";
import { formatDurationMinutes } from "../../utils/formatTime";

function RecentSessionItem({ title, category, duration }) {
  return (
    <Card style={{ height: "100%" }}>
      <CardContent
        style={{ paddingTop: 12, paddingBottom: 12, display: "flex", alignItems: "center", gap: 16 }}
      >
        <Box style={{ fontSize: 24, color: "var(--accent)" }}>
          <FaClock size={24} />
        </Box>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="muted">
            {category}
          </Typography>
        </Box>
        <Typography variant="body2" style={{ fontWeight: 500 }}>
          {formatDurationMinutes(duration)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function RecentSessions({ maxItems = 5 }) {
  const { sessions } = useSessions();

  const recentSessions = useMemo(() => {
    const sorted = [...sessions].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    return sorted.slice(0, maxItems);
  }, [sessions, maxItems]);

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 4 }}>
        Recent Sessions
      </Typography>
      {recentSessions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="muted">
              No sessions yet. Start a timer to begin tracking.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        recentSessions.map((s) => (
          <RecentSessionItem
            key={String(s.id)}
            title={s.title}
            category={s.category}
            duration={s.duration}
          />
        ))
      )}
    </Box>
  );
}
