import { useState, useEffect, useRef } from "react";
import "./styles/timer.css";

function Timer() {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart}(2, '0')}`;
  };

  //useEffect - countdown logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(20 * 60); //User will be back in 25 min.
  };

  return (
    <div className="timer-container">
      <h1>Focus Timer</h1>

      <div className="timer-display">{formatTime(timeLeft)}</div>

      <div className="timer-controls">
        {isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>

      <p>{isRunning ? "Timer running..." : "Timer paused"}</p>
    </div>
  );
}

export default Timer;
