import { FaPause, FaPlay, FaRedo } from "react-icons/fa";
import { Button, Box } from "../ui";

export default function TimerControls({ isRunning, onStart, onPause, onReset }) {
  return (
    <Box className="timer-controls" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {isRunning ? (
        <Button variant="contained" onClick={onPause}>
          <FaPause size={16} /> Pause
        </Button>
      ) : (
        <Button variant="contained" onClick={onStart}>
          <FaPlay size={16} /> Start
        </Button>
      )}
      <Button variant="outlined" onClick={onReset} disabled={!isRunning}>
        <FaRedo size={16} /> Reset
      </Button>
    </Box>
  );
}
