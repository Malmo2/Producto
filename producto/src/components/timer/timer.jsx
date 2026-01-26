import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import "./timer.css";

function Timer() {
  const [mode, setMode] = useState("work");
  const WORK_TIME = 50 * 60;
  const BREAK_TIME = 20 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [startTime, setStartTime] = useState(null);

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

  const handleStart = () => {
    setIsRunning(true);
    if (!startTime) {
      setStartTime(new Date());
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (mode === "work" && startTime) {
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime - startTime) / 1000);

      const newSession = {
        id: Date.now(),
        mode: mode,
        startTime: startTime,
        endTime: endTime,
        duration: durationInSeconds,
        date: new Date().toLocaleDateString("sv-SE"),
      };

      setSessions([...sessions, newSession]);
      setStartTime(null);
    }
  };

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
      {sessions.length > 0 && (
        <div className="sessions-list">
          <h3>Completed Sessions</h3>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                <span>{session.date}</span>
                <span>{Math.floor(session.duration / 60)} min</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Timer;
