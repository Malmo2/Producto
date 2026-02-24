import formatTime from "../../utils/formatTime";

export default function TimerDisplay({ timeLeft, totalTime, isRunning }) {
  // SVG Circle Math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate how much of the ring to "hide"
  // If totalTime is 0 (initial state), show 0 offset
  const percentage = totalTime > 0 ? timeLeft / totalTime : 0;
  const offset = circumference - percentage * circumference;

  return (
    <div className="timer-display-container">
      <svg className="timer-svg" viewBox="0 0 160 160">
        {/* Gray background ring */}
        <circle
          className="timer-ring-bg"
          cx="80"
          cy="80"
          r={radius}
        />
        {/* Blue progress ring */}
        <circle
          className="timer-ring-progress"
          cx="80"
          cy="80"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: isNaN(offset) ? 0 : offset,
          }}
        />
      </svg>
      <div className="timer-text-overlay">
        <div className="time-text">{formatTime(timeLeft)}</div>
        <p className="status-text">{isRunning ? "FOCUSING" : "PAUSED"}</p>
      </div>
    </div>
  );
}