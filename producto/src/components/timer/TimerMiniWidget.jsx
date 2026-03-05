import { useMemo } from "react";
import { useTimer } from "../../contexts/TimerContext";
import { Box, Typography, Button } from "../ui";
import formatTime from "../../utils/formatTime";

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

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 10px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Box
        style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}
      >
        <Typography variant="body2" color="muted">
          {modeLabel}
        </Typography>
        <Typography
          variant="subtitle1"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {label}
        </Typography>
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
