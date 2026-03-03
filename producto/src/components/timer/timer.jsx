import { useState, useEffect, useRef, useReducer } from "react";
import { timerReducer, initialTimerState } from "./timerReducer";
import "./timer.css";
import { useSessions } from "../../contexts/SessionContext";
import { useTheme } from "../Darkmode/ThemeContext";
import { useAuthState } from "../../contexts/AuthContext";
import { useEnergy } from "../energy/context/EnergyContext";
import { useRecommendationPlan } from "../../contexts/RecommendationPlanContext";

import ModeSelector from "./ModeSelector";

import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import SessionPopup from "./SessionPopup";
import ActivitySessionSidebar from "./ActivitySessionSidebar";
import RecentSessions from "./RecentSessions";

const TIMER_DEFAULTS_KEY = "timerDefaults";
const TIMER_START_INTENT_KEY = "timerStartIntent";
const TIMER_DEFAULTS_FALLBACK = {
  work: 15,
  meeting: 45,
  break: 5,
};

function readTimerDefaults() {
  const savedDefaults = localStorage.getItem(TIMER_DEFAULTS_KEY);
  if (!savedDefaults) return TIMER_DEFAULTS_FALLBACK;

  try {
    const parsed = JSON.parse(savedDefaults);
    return {
      work: Number(parsed?.work) > 0 ? Number(parsed.work) : TIMER_DEFAULTS_FALLBACK.work,
      meeting: Number(parsed?.meeting) > 0 ? Number(parsed.meeting) : TIMER_DEFAULTS_FALLBACK.meeting,
      break: Number(parsed?.break) > 0 ? Number(parsed.break) : TIMER_DEFAULTS_FALLBACK.break,
    };
  } catch {
    return TIMER_DEFAULTS_FALLBACK;
  }
}

function getMinutesForMode(mode) {
  const defaults = readTimerDefaults();
  return Number(defaults[mode]) > 0 ? Number(defaults[mode]) : TIMER_DEFAULTS_FALLBACK.work;
}

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
  const [sessionCategory, setSessionCategory] = useState("Deep Work");

  const categories = ["Deep Work", "Meeting", "Testing", "On break", "Other"];

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

  useEffect(() => {
    const startIntentRaw = localStorage.getItem(TIMER_START_INTENT_KEY);
    if (!startIntentRaw) return;

    try {
      const startIntent = JSON.parse(startIntentRaw);
      const mode = startIntent?.mode;
      const minutes = Number(startIntent?.minutes);

      if (!["work", "meeting", "break"].includes(mode) || !(minutes > 0)) {
        return;
      }

      dispatch({ type: "CHANGE_MODE", payload: mode });
      dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });
      dispatch({ type: "START_TIMER" });

      localStorage.setItem("customMinutes", String(minutes));
      window.dispatchEvent(new Event("customMinutesChanged"));
    } catch {
    } finally {
      localStorage.removeItem(TIMER_START_INTENT_KEY);
    }
  }, []);

  const handleStart = () => {
    dispatch({ type: "START_TIMER" });
  };

  const handlePause = () => {
    dispatch({ type: "PAUSE_TIMER" });
    if (state.startTime) setShowPopup(false);
  };

  const handleEndSession = () => {
    dispatch({ type: "PAUSE_TIMER" });
    if (state.startTime) {
      setShowPopup(true);
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET_TIMER" });
  };

  const handleModeChange = (selectedMode) => {
    dispatch({ type: "CHANGE_MODE", payload: selectedMode });

    const minutes = getMinutesForMode(selectedMode);
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });
    localStorage.setItem("customMinutes", String(minutes));

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
    const startMs = state.startTime ? new Date(state.startTime).getTime() : null;
    const durationInSeconds =
      startMs != null ? Math.max(0, Math.floor((endTime.getTime() - startMs) / 1000)) : 0;

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

    dispatch({ type: "RESET_TIMER" });

    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Deep Work");
  };

  const handleCancelPopup = () => {
    dispatch({ type: "RESET_TIMER" });

    setShowPopup(false);
    setSessionTitle("");
    setSessionCategory("Deep Work");
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

          <ModeSelector mode={state.mode} onModeChange={handleModeChange} />

          <TimerDisplay
            timeLeft={state.timeLeft}
            isRunning={state.isRunning}
            totalTime={(Number(state.customMinutes) || 0) * 60}
          />

          {state.isRunning && state.startTime && (
            <p className="timer-tracking-text">Tracking focus for {user?.name || "User"}</p>
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
            onEndSession={handleEndSession}
          />

          <div className="timer-recent-sessions">
            <RecentSessions maxItems={5} />
          </div>
        </div>
      </div>
    </>
  );
}