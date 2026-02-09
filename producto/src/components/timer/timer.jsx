import { useState, useEffect, useRef } from "react";
import Button from "../button/button";
import formatTime from "../../utils/formatTime";
import "./timer.css";

export default function Timer() {
  const [mode, setMode] = useState("work");
  const WORK_TIME = 50 * 60;
  const MEETING_TIME = 25 * 60;
  const BREAK_TIME = 20 * 60;

  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(() => {
    const saved = localStorage.getItem("customMinutes");
    return saved ? Number(saved) : "";
  });
  const intervalRef = useRef(null);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("timerSessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [startTime, setStartTime] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionCategory, setSessionCategory] = useState("Working");

  const Categories = ["Coding", "Meeting", "Testing", "On break", "Other"];

  useEffect(() => {
    localStorage.setItem("timerSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (customMinutes !== "") {
      localStorage.setItem("customMinutes", customMinutes.toString());
    }
  }, [customMinutes]);

  useEffect(() => {
    if (customMinutes !== "" && timeLeft === 0) {
      setTimeLeft(customMinutes * 60);
    }
  }, []);

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
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

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
    if (customMinutes !== "") {
      setTimeLeft(customMinutes * 60);
    }
  };

  const handleClearSessions = () => {
    setSessions([]);
    localStorage.removeItem("timerSessions");
  };

  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId,
    );
    setSessions(updatedSessions);
  };

  const getTotal = () => {
    const totalSeconds = sessions.reduce((total, session) => {
      return total + session.duration;
    }, 0);
    return Math.floor(totalSeconds / 60);
  };

  const formatTotalTime = () => {
    const totalMinutes = getTotal();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const DAILY_GOAL = 480;

  const getProgress = () => {
    return Math.min((getTotal() / DAILY_GOAL) * 100, 100);
  };

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Save your work session</h2>

            <div className="popup-field">
              <label>What did you work on?</label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="Fixed something.."
                autoFocus
              />
            </div>

            <div className="popup-field">
              <label>Category</label>
              <select
                value={sessionCategory}
                onChange={(e) => setSessionCategory(e.target.value)}
              >
                {Categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="popup-buttons">
              <Button onClick={handleSaveSession}>Save</Button>
              <Button
                onClick={() => {
                  setShowPopup(false);
                  setSessionTitle("");
                  setStartTime(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="timer-container">
        <h1>Timer</h1>
        <div className="mode-selector">
          <button
            className={mode === "work" ? "mode-btn active" : "mode-btn"}
            onClick={() => {
              setMode("work");
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
              setIsRunning(false);
              setStartTime(null);
            }}
          >
            Break
          </button>
        </div>

        <div className="time-input">
          <label>Minutes</label>
          <input
            type="number"
            min="1"
            max="120"
            value={customMinutes}
            placeholder="Enter time"
            disabled={isRunning}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              setCustomMinutes(val);
              if (val !== "") setTimeLeft(val * 60);
            }}
          />
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
                  <div>
                    <strong>{session.title}</strong>
                    <span className="session-category">
                      {" "}
                      ({session.category})
                    </span>
                  </div>
                  <div className="session-info">
                    <span>{session.date}</span>
                    <span> • {Math.floor(session.duration / 60)} min</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteSession(session.id)}
                      title="Delete session"
                    >
                      ✕
                    </button>
                  </div>
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
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>

            <p className="goal-text">
              DAILY GOAL: 8H • {Math.round(getProgress())}%
            </p>
          </div>
        )}
      </div>
    </>
  );
}
