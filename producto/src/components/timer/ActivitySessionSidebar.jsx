import { useState, useEffect } from "react";
import { FaInfoCircle, FaLightbulb } from "react-icons/fa";
import { Button, Typography, Box } from "../ui";

export default function ActivitySessionSidebar({
  isRunning,
  startTime,
  totalMinutes,
  timeLeft,
  userName,
  onEndSession,
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!startTime || (!isRunning && timeLeft === (totalMinutes || 0) * 60)) {
      setElapsedMinutes(0);
      return;
    }

    const computeElapsed = () => {
      if (isRunning && startTime) {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        setElapsedMinutes(Math.floor(seconds / 60));
      } else {
        const totalSeconds = (totalMinutes || 0) * 60;
        const elapsed = totalSeconds - timeLeft;
        setElapsedMinutes(Math.max(0, Math.floor(elapsed / 60)));
      }
    };

    computeElapsed();
    const id = isRunning ? setInterval(computeElapsed, 1000) : null;
    return () => clearInterval(id);
  }, [isRunning, startTime, totalMinutes, timeLeft]);

  const hasActiveSession = !!startTime;

  return (
    <aside className="activity-session-sidebar">
      <Box className="activity-session-header">
        <Typography variant="h6" component="h3" className="activity-session-title">
          Activity Session
        </Typography>
        <FaInfoCircle size={18} className="activity-session-info-icon" />
      </Box>

      <Box className="activity-session-elapsed">
        <Typography variant="body2" color="muted" className="activity-session-label">
          Time elapsed
        </Typography>
        <Typography variant="subtitle1" className="activity-session-value">
          {elapsedMinutes} min
        </Typography>
      </Box>

      <Box className="activity-session-tip">
        <FaLightbulb size={20} className="activity-session-tip-icon" />
        <Typography variant="body2" className="activity-session-tip-text">
          TIP: Spend at least 15-30 minutes to stay focused.
        </Typography>
      </Box>

      <Button
        variant="outlined"
        onClick={onEndSession}
        disabled={!hasActiveSession}
        className="activity-session-end-btn"
      >
        End Session
      </Button>
    </aside>
  );
}
