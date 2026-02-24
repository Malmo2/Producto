import { useState, useEffect, useRef, useReducer } from "react";
import { timerReducer, initialTimerState } from "./timerReducer";
import "./timer.css";
import { useSessions } from "../../contexts/SessionContext";
import { useTheme } from "../Darkmode/ThemeContext";
import { useAuthState } from "../../contexts/AuthContext";
import { useEnergy } from "../energy/context/EnergyContext";
import { useRecommendationPlan } from "../../contexts/RecommendationPlanContext";

import ModeSelector from "./ModeSelector";
import TimeInput from "./TimeInput";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import SessionPopup from "./SessionPopup";
import ActivitySessionSidebar from "./ActivitySessionSidebar";
import RecentSessions from "./RecentSessions";

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

  const { addLog } = useEnergy();
  const { addSession } = useSessions();
  const { plan, clearPlan } = useRecommendationPlan();
  const { user } = useAuthState();
  const { theme } = useTheme();

  const intervalRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionCategory, setSessionCategory] = useState("Working");

  const categories = ["Coding", "Meeting", "Testing", "On break", "Other"];

  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TIMER_TICK" });
      }, 1000);
    } else if (state.timeLeft === 0) {
      dispatch({ type: "PAUSE_TIMER" });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.timeLeft]);

  useEffect(() => {
    if (!plan) return;

    dispatch({ type: "CHANGE_MODE", payload: plan.timerMode });
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: plan.minutes });

    localStorage.setItem("customMinutes", String(plan.minutes));
    window.dispatchEvent(new Event("customMinutesChanged"));

    clearPlan();
  }, [plan, clearPlan]);

  const handleStart = () => {
    dispatch({ type: "START_TIMER" });
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER" });
    if (state.startTime) setShowPopup(true);
  };

  const handleReset = () => {
    dispatch({ type: "RESET_TIMER" });
  };

  const handleModeChange = (selectedMode) => {
    dispatch({ type: "CHANGE_MODE", payload: selectedMode });

    if (selectedMode === "work") {
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: 50 });
      localStorage.setItem("customMinutes", "50");
    } else if (selectedMode === "meeting") {
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: 25 });
      localStorage.setItem("customMinutes", "25");
    } else if (selectedMode === "break") {
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: 15 });
      localStorage.setItem("customMinutes", "15");
    }

    window.dispatchEvent(new Event("customMinutesChanged"));
  };

  const handleMinutesChange = (e) => {
    const val = e.target.value === "" ? "" : Number(e.target.value);

    dispatch({ type: "SET_CUSTOM_MINUTES", payload: val });

    if (val === "") localStorage.removeItem("customMinutes");
    else localStorage.setItem("customMinutes", String(val));

    window.dispatchEvent(new Event("customMinutesChanged"));
  };

  const handleSaveSession = (energyLevel) => {
    if (!sessionTitle.trim()) {
      alert("You have to fill in a title");
      return;
    }

    if (energyLevel == null) {
      alert("Pick an energy level before saving.");
      return;
    }

    const endTime = new Date();
    const durationInSeconds = state.startTime
      ? Math.max(0, Math.floor((endTime - state.startTime) / 1000))
      : 0;

    const sessionId = crypto.randomUUID?.() ?? String(Date.now());

    const newSession = {
      id: sessionId,
      title: sessionTitle,
      category: sessionCategory,
      startTime: state.startTime,
      endTime,
      duration: durationInSeconds,
      date: new Date().toLocaleDateString("sv-SE"),
      energy: energyLevel,
    };

    addSession(newSession);
    addLog?.(energyLevel, { id: sessionId, sessionId });

    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Working");
  };

  const handleCancelPopup = () => {
    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Working");
  };

  return (
    <>
      <SessionPopup
        show={showPopup}
        sessionTitle={sessionTitle}
        sessionCategory={sessionCategory}
        categories={categories}
        onTitleChange={(e) => setSessionTitle(e.target.value)}
        onCategoryChange={(e) => setSessionCategory(e.target.value)}
        onSave={handleSaveSession}
        onCancel={handleCancelPopup}
      />

      <div className={`timer-container timer-page-layout ${theme}`}>
        <div className="timer-page-main">
          <h1>Timer</h1>

          <ModeSelector mode={state.mode} onModeChange={handleModeChange} />

          <TimeInput
            customMinutes={state.customMinutes}
            isRunning={state.isRunning}
            onChange={handleMinutesChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !state.isRunning) handleStart();
            }}
          />

          <TimerDisplay
            timeLeft={state.timeLeft}
            isRunning={state.isRunning}
            totalTime={(Number(state.customMinutes) || 0) * 60}
          />

          {state.isRunning && state.startTime && (
            <p className="timer-tracking-text">
              Tracking focus for {user?.name || "User"}
            </p>
          )}

          <TimerControls
            isRunning={state.isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
        </div>

        <div className="timer-page-sidebar">
          <ActivitySessionSidebar
            isRunning={state.isRunning}
            startTime={state.startTime}
            totalMinutes={Number(state.customMinutes) || 0}
            timeLeft={state.timeLeft}
            userName={user?.name}
            onEndSession={handlePause}
          />

          <div className="timer-recent-sessions">
            <RecentSessions maxItems={5} />
          </div>
        </div>
      </div>
    </>
  );
}