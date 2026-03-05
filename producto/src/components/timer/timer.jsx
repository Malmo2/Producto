import "./timer.css";
import { useTheme } from "../Darkmode/ThemeContext";
import { useAuthState } from "../../contexts/AuthContext";
import { useTimer } from "../../contexts/TimerContext";

import ModeSelector from "./ModeSelector";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import ActivitySessionSidebar from "./ActivitySessionSidebar";
import RecentSessions from "./RecentSessions";

export default function Timer() {
  const { theme } = useTheme();
  const { user } = useAuthState();
  const {
    state,
    startTimer,
    pauseTimer,
    resetTimer,
    setModeWithDefaults,
    endSession,
    closeSessionPopup,
  } = useTimer();

  const handleStart = () => {
    startTimer();
  };

  const handlePause = () => {
    pauseTimer();
    closeSessionPopup();
  };

  const handleReset = () => {
    resetTimer();
    closeSessionPopup();
  };

  const handleModeChange = (selectedMode) => {
    setModeWithDefaults(selectedMode);
  };

  const handleEndSession = () => {
    endSession();
  };

  return (
    <div className={`timer-container timer-page-layout ${theme}`}>
      <div className="timer-page-main">
        <ModeSelector mode={state.mode} onModeChange={handleModeChange} />

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
          onEndSession={handleEndSession}
        />

        <div className="timer-recent-sessions">
          <RecentSessions maxItems={5} />
        </div>
      </div>
    </div>
  );
}
