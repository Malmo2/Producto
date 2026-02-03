import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import formatTime from "../../utils/formatTime";
import "./timer.css";

export default function Timer() {
  const [mode, setMode] = useState("work");
  const WORK_TIME = 50 * 60;
  const MEETING_TIME = 25 * 60;
  const BREAK_TIME = 20 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("timerSessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [startTime, setStartTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionCategory, setSessionCategory] = useState("Working");

  const Categories = ["Coding", "Meeting", "Testing", "On break"];

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

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
      setShowPopup(true);
    }
  };

  const handleSaveSession = () => {
    if (!sessionTitle.trim()) {
      alert("You have to fill in a title");
      return;
    }

    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - start) / 1000);

    const newSession = {
      id: Date.now(),
      mode: mode,
      title: sessionTitle,
      category: sessionCategory,
      startTime: startTime,
      endTime: endTime,
      duration: durationInSeconds,
      date: new Date().toLocaleDateString("sv-SE"),
    };

    setSessions([...sessions, newSession]);
    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Working");
    setStartTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);

    if (mode === "work") {
      setTimeLeft(WORK_TIME);
    } else if (mode === "meeting") {
      setTimeLeft(MEETING_TIME);
    } else {
      setTimeLeft(BREAK_TIME);
    }
  };

  const handleClearSessions = () => {
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  const getTotal = () => {
    const totalSeconds = sessions.reduce((total, session) => {
      return total + session.duration;
    }, 0);
    return Math.floor(totalSeconds / 60);
  };

  //This formats as X=h and Y=m
  const formatTotalTime = () => {
    const totalMinutes = getTotal();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  //Set daily goal 8h - 480 minutes
  const DAILY_GOAL = 480;

  //progress in %
  const getProgress = () => {
    return Math.min((getTotal() / DAILY_GOAL) * 100, 100);
  };

  return (
    <div className="timer-container">
      <h1>Timer</h1>
      <div className="mode-selector">
        <button
          className={mode === "work" ? "mode-btn active" : "mode-btn"}
          onClick={() => {
            setMode("work");
            setTimeLeft(WORK_TIME);
            setIsRunning(false);
            setStartTime(null);
          }}
        >
          Work
        </button>

        <button
          className={mode === "meeting" ? "mode-btn active" : "mode-btn"}
          onClick={() => {
            setMode("meeting");
            setTimeLeft(MEETING_TIME);
            setIsRunning(false);
            setStartTime(null);
          }}
        >
          Meeting
        </button>

        <button
          className={mode === "break" ? "mode-btn active" : "mode-btn"}
          onClick={() => {
            setMode("break");
            setTimeLeft(BREAK_TIME);
            setIsRunning(false);
            setStartTime(null);
          }}
        >
          Break
        </button>
      </div>
      <div className="timer-display">
        <div className="time-text">{formatTime(timeLeft)}</div>

        <p className="status-text">
          {mode === "work" ? "Working Mode" : "On break "} -{" "}
          {isRunning ? "Running..." : "Paused"}
        </p>
      </div>
      <div className="timer-controls">
        {isRunning ? (
          <Button onClick={handlePause}>Pause</Button>
        ) : (
          <Button onClick={handleStart}>Start</Button>
        )}
        <Button onClick={handleReset} disabled={!isRunning}>
          Reset
        </Button>
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
          <Button onClick={handleClearSessions}>Clear history</Button>
        </div>
      )}

      {sessions.length > 0 && (
        <div className="total-focus">
          <h3>TOTAL FOCUSED TODAY</h3>
          <p className="total-time">{formatTotalTime()}</p>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `{getProgress()}` }}
            ></div>
          </div>

          <p className="goal-texg">
            DAILY GOAL: 8H • {Math.round(getProgress())}%
          </p>
        </div>
      )}
    </div>
  );
}
