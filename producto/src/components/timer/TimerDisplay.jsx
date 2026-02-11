import formatTime from "../../utils/formatTime";

export default function TimerDisplay({ timeLeft, isRunning }) {
  return (
    <div className="timer-display">
      <div className="time-text">{formatTime(timeLeft)}</div>
      <p className="status-text">{isRunning ? "Running..." : "Paused"}</p>
    </div>
  );
}
