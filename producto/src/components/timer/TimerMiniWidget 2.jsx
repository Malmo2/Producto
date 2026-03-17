import { useMemo } from "react";
import { useTimer } from "../../contexts/TimerContext";
import { Box, Typography, Button } from "../ui";
import formatTime from "../../utils/formatTime";
import "./timer.css";

export default function TimerMiniWidget() {
  const { state, startTimer, pauseTimer } = useTimer();

  const label = useMemo(() => formatTime(state.timeLeft), [state.timeLeft]); // reformat only when timeLeft changes
  const modeLabel = useMemo(() => {
    if (state.mode === "work") return "Work";
    if (state.mode === "meeting") return "Meeting";
    if (state.mode === "break") return "Break";
    return "Timer";
  }, [state.mode]);

  const handleToggle = () => {
    if (state.isRunning) pauseTimer();
    else startTimer();
  };

  const total = Math.max(1, state.customMinutes * 60);
  const progress = Math.max(0, Math.min(1, state.timeLeft / total));

  const R = 12;
  const C = 2 * Math.PI * R;

  const offset = C * (1 - progress);

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 10px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        maxWidth: "160px",
      }}
    >
      <Box style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <Typography variant="body2" color="muted">
          {modeLabel}
        </Typography>
        <Typography variant="subtitle1" style={{ fontVariantNumeric: "tabular-nums" }}>
          {label}
        </Typography>
      </Box>

      <Box style={{ width: 28, height: 28, display: "grid", placeItems: "center" }}>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="3"
          />

          <circle
            cx="14"
            cy="14"
            r={R}
            fill="none"
            stroke="var(--timer-blue, #2563eb)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            transform="rotate(-90 14 14)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
      </Box>
      <Button
        size="small"
        variant={state.isRunning ? "outlined" : "contained"}
        onClick={handleToggle}
      >
        {state.isRunning ? "Pause" : "Start"}
      </Button>

    </Box>
  );
}