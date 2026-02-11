import { useState, useEffect, useRef, useReducer } from "react";
import { timerReducer, initialTimerState } from "./timerReducer";
import Button from "../button/button";
import formatTime from "../../utils/formatTime";
import "./timer.css";
import { useSessions } from "../../contexts/SessionContext";

function initTimerState() {
  const saved = localStorage.getItem("customMinutes");
  const customMinutes = saved ? Number(saved) : "";

  return {
    ...initialTimerState, //All defaults from timerReducer
    customMinutes, //If there is a saved value, use it, otherwise use an empty string
    timeLeft: customMinutes !== "" ? customMinutes * 60 : 0, //And over timeLeft if there is a saved customMinutes, set timeLeft to that value in seconds, otherwise 0
  };
}

export default function Timer() {
  const [state, dispatch] = useReducer(timerReducer, null, initTimerState);

  const intervalRef = useRef(null);
  const { sessions, addSession, deleteSession, clearSessions } = useSessions();
  const [showPopup, setShowPopup] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionCategory, setSessionCategory] = useState("Working");

  const Categories = ["Coding", "Meeting", "Testing", "On break", "Other"];

  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TIMER_TICK" });
      }, 1000);
    } else if (state.timeLeft === 0) {
      dispatch({ type: "PAUSE_TIMER" });
    }
    return () => clearInterval(intervalRef.current);
  }, [state.isRunning, state.timeLeft]);

  const handleStart = () => {
    dispatch({ type: "START_TIMER" });
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER" });

    if (state.startTime) {
      setShowPopup(true);
    }
  };

  const handleSaveSession = () => {
    if (!sessionTitle.trim()) {
      alert("You have to fill in a title");
      return;
    }

    const endTime = new Date();
    const durationInSeconds = Math.floor((endTime - state.startTime) / 1000);

    const newSession = {
      id: Date.now(),
      title: sessionTitle,
      category: sessionCategory,
      startTime: state.startTime,
      endTime: endTime,
      duration: durationInSeconds,
      date: new Date().toLocaleDateString("sv-SE"),
    };
    addSession(newSession);
    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Working");
  };

  const handleReset = () => {
    dispatch({ type: "RESET_TIMER" });
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

        <div className="time-input">
          <input
            type="number"
            min="1"
            max="120"
            value={state.customMinutes}
            placeholder="Enter time"
            disabled={state.isRunning}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              dispatch({ type: "SET_CUSTOM_MINUTES", payload: val });
            }}
          />
          <label>Minutes</label>
        </div>

        <div className="timer-display">
          <div className="time-text">{formatTime(state.timeLeft)}</div>

          <p className="status-text">
            {state.isRunning ? "Running..." : "Paused"}
          </p>
        </div>

        <div className="timer-controls">
          {state.isRunning ? (
            <Button onClick={handlePause}>Pause</Button>
          ) : (
            <Button onClick={handleStart}>Start</Button>
          )}
          <Button onClick={handleReset} disabled={!state.isRunning}>
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
                      onClick={() => deleteSession(session.id)}
                      title="Delete session"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Button onClick={clearSessions}>Clear history</Button>
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
