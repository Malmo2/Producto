import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import "./timer.css";

function Timer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(20 * 60);
  };

  return (
    <div className="timer-container">
      <h1>Timer</h1>

      <div className="timer-display">
        <div className="time-text">{formatTime(timeLeft)}</div>
        <p className="status-text">{isRunning ? "On a break..." : "Paused"}</p>
      </div>

      <div className="timer-controls">
        {isRunning ? (
          <Button onClick={handlePause}>Pause</Button>
        ) : (
          <Button onClick={handleStart}>Start</Button>
        )}
        <Button onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}

export default Timer;
