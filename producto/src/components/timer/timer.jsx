import { useState, useEffect, useRef, useReducer } from "react";
import { timerReducer, initialTimerState } from "./timerReducer";
import "./timer.css";
import { useSessions } from "../../contexts/SessionContext";
import ModeSelector from "./ModeSelector";
import TimeInput from "./TimeInput";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import SessionPopup from "./SessionPopup";
import SessionsList from "./SessionsList";
import TotalFocus from "./TotalFocus";

function initTimerState() {
  const saved = localStorage.getItem("customMinutes");
  const customMinutes = saved ? Number(saved) : "";

  return {
    ...initialTimerState,
    customMinutes,
    timeLeft: customMinutes !== "" ? customMinutes * 60 : 0,
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
  const handleModeChange = (selectedMode) => {
    dispatch({ type: "CHANGE_MODE", payload: selectedMode });

    if (selectedMode === "work") {
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: 50 });
    } else if (selectedMode === "break") {
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: 15 });
    }
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

  return (
    <>
      <SessionPopup
        show={showPopup}
        sessionTitle={sessionTitle}
        sessionCategory={sessionCategory}
        categories={Categories}
        onTitleChange={(e) => setSessionTitle(e.target.value)}
        onCategoryChange={(e) => setSessionCategory(e.target.value)}
        onSave={handleSaveSession}
        onCancel={() => {
          setShowPopup(false);
          setSessionTitle("");
        }}
      />

      <div className="timer-container">
        <h1>Timer</h1>

        <ModeSelector mode={state.mode} onModeChange={handleModeChange} />

        <TimeInput
          customMinutes={state.customMinutes}
          isRunning={state.isRunning}
          onChange={(e) => {
            const val = e.target.value === "" ? "" : Number(e.target.value);
            dispatch({ type: "SET_CUSTOM_MINUTES", payload: val });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !state.isRunning) {
              handleStart();
            }
          }}
        />

        <TimerDisplay timeLeft={state.timeLeft} isRunning={state.isRunning} />

        <TimerControls
          isRunning={state.isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        <SessionsList
          sessions={sessions}
          onDelete={deleteSession}
          onClearAll={clearSessions}
        />

        <TotalFocus sessions={sessions} dailyGoal={480} />
      </div>
    </>
  );
}
