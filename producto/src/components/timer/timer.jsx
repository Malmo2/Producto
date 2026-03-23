import "./timer.css";
import { useTheme } from "../Darkmode/ThemeContext";
import { useAuthState } from "../../contexts/AuthContext";
import { useTimer } from "../../contexts/TimerContext";

import ModeSelector from "./ModeSelector";
import TimerDisplay from "./TimerDisplay";
import TimerControls from "./TimerControls";
import ActivitySessionSidebar from "./ActivitySessionSidebar";
import RecentSessions from "./RecentSessions";

/**
 * Timer page component that orchestrates the full timer experience.
 *
 * Composes mode selection, countdown display, session controls and
 * a sidebar with activity tracking and recent sessions.
 *
 * Consumes {@link useTheme}, {@link useAuthState} and {@link useTimer}
 * from their respective contexts — no props required.
 *
 * @component
 * @returns {JSX.Element} The full timer page layout.
 */
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

  /**
   * Starts the timer countdown.
   */
  const handleStart = () => {
    startTimer();
  };

  /**
   * Pauses the timer and closes any open session popup.
   */
  const handlePause = () => {
    pauseTimer();
    closeSessionPopup();
  };

  /**
   * Resets the timer to its initial state and closes any open session popup.
   */
  const handleReset = () => {
    resetTimer();
    closeSessionPopup();
  };

  /**
   * Updates the active timer mode and applies its default duration.
   *
   * @param {string} selectedMode - The mode identifier to switch to (e.g. "pomodoro", "short-break").
   */
  const handleModeChange = (selectedMode) => {
    setModeWithDefaults(selectedMode);
  };

  /**
   * Ends the current focus session and triggers any session-save logic in context.
   */
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
