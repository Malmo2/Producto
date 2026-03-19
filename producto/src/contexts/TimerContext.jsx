import {
  useState,
  useMemo,
  useContext,
  createContext,
  useEffect,
  useRef,
  useReducer,
} from "react";
import {
  timerReducer,
  initialTimerState,
} from "../components/timer/timerReducer";
import { useRecommendationPlan } from "./RecommendationPlanContext";
import { useLocation } from "react-router-dom";

const TimerContext = createContext(null);

const TIMER_DEFAULTS_KEY = "timerDefaults";
const TIMER_SNAPSHOT_KEY = "timerSnapshotV1";
const TIMER_DEFAULTS_FALLBACK = { work: 15, meeting: 45, break: 5 };

/**
 * Reads saved timer default lengths from localStorage.
 *
 * If the value is missing, invalid, or contains non-positive numbers,
 * fallback defaults are returned instead.
 *
 * @returns {{ work: number, meeting: number, break: number }}
 */
function readTimerDefaults() {
  const raw = localStorage.getItem(TIMER_DEFAULTS_KEY);
  if (!raw) return TIMER_DEFAULTS_FALLBACK;

  try {
    const parsed = JSON.parse(raw);
    return {
      work:
        Number(parsed?.work) > 0
          ? Number(parsed.work)
          : TIMER_DEFAULTS_FALLBACK.work,
      meeting:
        Number(parsed?.meeting) > 0
          ? Number(parsed.meeting)
          : TIMER_DEFAULTS_FALLBACK.meeting,
      break:
        Number(parsed?.break) > 0
          ? Number(parsed.break)
          : TIMER_DEFAULTS_FALLBACK.break,
    };
  } catch {
    return TIMER_DEFAULTS_FALLBACK;
  }
}

/**
 * Returns the configured number of minutes for a given timer mode.
 *
 * @param {"work" | "meeting" | "break"} mode
 * @returns {number}
 */
function minutesForMode(mode) {
  const defaults = readTimerDefaults();
  const n = Number(defaults?.[mode]);
  return n > 0 ? n : TIMER_DEFAULTS_FALLBACK.work;
}

/**
 * Safely parses JSON and returns null if parsing fails.
 *
 * @param {string} raw
 * @returns {any | null}
 */
function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Builds the timer's initial state.
 *
 * This function tries to restore the timer from a saved snapshot in localStorage.
 * If no snapshot exists, it starts from the reducer's initial state using
 * the saved default minutes for the current mode.
 *
 * It also recalculates `timeLeft` when a timer was running and the page reloads,
 * so the countdown stays accurate after refresh.
 *
 * @returns {object}
 */
function buildInitialState() {
  const snapRaw = localStorage.getItem(TIMER_SNAPSHOT_KEY);
  const snap = snapRaw ? safeParseJson(snapRaw) : null;

  if (!snap) {
    const mode = initialTimerState.mode;
    const minutes = minutesForMode(mode);
    return {
      ...initialTimerState,
      mode,
      customMinutes: minutes,
      timeLeft: minutes * 60,
    };
  }

  const mode = ["work", "meeting", "break"].includes(snap.mode)
    ? snap.mode
    : initialTimerState.mode;

  const startTime = typeof snap.startTime === "string" ? snap.startTime : null;
  const endTime = typeof snap.endTime === "string" ? snap.endTime : null;
  const isRunning = Boolean(snap.isRunning);

  const hasSession = Boolean(startTime);

  if (!isRunning && !hasSession) {
    const defaultMinutes = minutesForMode(mode);

    const snapMinutesCandidate = Number(snap.customMinutes);
    const customMinutes =
      Number.isFinite(snapMinutesCandidate) && snapMinutesCandidate > 0
        ? snapMinutesCandidate
        : defaultMinutes;

    const snapTimeLeftCandidate = Number(snap.timeLeft);
    const timeLeft =
      Number.isFinite(snapTimeLeftCandidate) && snapTimeLeftCandidate >= 0
        ? snapTimeLeftCandidate
        : customMinutes * 60;

    return {
      ...initialTimerState,
      mode,
      customMinutes,
      timeLeft,
      isRunning: false,
      startTime: null,
      endTime: null,
    };
  }

  const defaultMinutes = minutesForMode(mode);
  const snapMinutesCandidate = Number(snap.customMinutes);
  const customMinutes =
    Number.isFinite(snapMinutesCandidate) && snapMinutesCandidate > 0
      ? snapMinutesCandidate
      : defaultMinutes;

  let timeLeftCandidate = Number(snap.timeLeft);
  let timeLeft =
    Number.isFinite(timeLeftCandidate) && timeLeftCandidate >= 0
      ? timeLeftCandidate
      : customMinutes * 60;

  if (isRunning && endTime) {
    const endMs = new Date(endTime).getTime();
    const nowMs = Date.now();
    timeLeft = Math.max(0, Math.ceil((endMs - nowMs) / 1000));
  }

  const reallyRunning = isRunning && timeLeft > 0;

  return {
    ...initialTimerState,
    mode,
    customMinutes,
    timeLeft,
    isRunning: reallyRunning,
    startTime,
    endTime: reallyRunning ? endTime : null,
  };
}

/**
 * Checks whether the session popup should automatically open on page load.
 *
 * This is used when a session had already finished before the app reloaded.
 *
 * @returns {boolean}
 */
function shouldOpenPopupOnLoad() {
  const snapRaw = localStorage.getItem(TIMER_SNAPSHOT_KEY);
  const snap = snapRaw ? safeParseJson(snapRaw) : null;
  if (!snap) return false;

  const hasStart =
    typeof snap.startTime === "string" && snap.startTime.length > 0;

  const isFinished =
    Number(snap.timeLeft) === 0 &&
    Boolean(snap.isRunning) === false &&
    hasStart;

  return isFinished;
}

/**
 * Provides timer state and timer actions to all children through React context.
 *
 * Responsibilities:
 * - restore timer state from localStorage
 * - keep timer ticking while running
 * - persist snapshot changes
 * - react to timer-default changes
 * - apply recommendation plans when entering the /timer route
 * - control the session popup
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function TimerProvider({ children }) {
  const { plan, clearPlan, consumePlan } = useRecommendationPlan();
  const location = useLocation();

  const [state, dispatch] = useReducer(
    timerReducer,
    undefined,
    buildInitialState,
  );

  const [isSessionPopupOpen, setIsSessionPopupOpen] = useState(() =>
    shouldOpenPopupOnLoad(),
  );

  const intervalRef = useRef(null);
  const prevTimeLeftRef = useRef(state.timeLeft);

  /**
   * Starts the ticking interval whenever the timer is running,
   * and clears it when the timer stops or the component unmounts.
   */
  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [state.isRunning]);

  /**
   * Keeps a ref pointing at the latest state so event listeners
   * can read fresh values without re-registering.
   */
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /**
   * Detects the moment a session finishes.
   *
   * When timeLeft changes from a positive number to 0,
   * the timer is paused and the session popup opens.
   */
  useEffect(() => {
    const prev = prevTimeLeftRef.current;
    prevTimeLeftRef.current = state.timeLeft;

    const finishedNow = prev > 0 && state.timeLeft === 0;
    const hasSession = Boolean(state.startTime);

    if (finishedNow && hasSession) {
      dispatch({ type: "PAUSE_TIMER" });
      setIsSessionPopupOpen(true);
    }
  }, [state.timeLeft, state.startTime]);

  /**
   * Persists the current timer snapshot to localStorage
   * whenever important timer values change.
   */
  useEffect(() => {
    const snapshot = {
      mode: state.mode,
      customMinutes: state.customMinutes,
      timeLeft: state.timeLeft,
      isRunning: state.isRunning,
      startTime: state.startTime,
      endTime: state.endTime,
    };

    localStorage.setItem(TIMER_SNAPSHOT_KEY, JSON.stringify(snapshot));
  }, [
    state.mode,
    state.customMinutes,
    state.timeLeft,
    state.isRunning,
    state.startTime,
    state.endTime,
  ]);

  /**
   * Listens for external timer-default updates.
   *
   * If the current timer is idle and using the previous default value,
   * this effect resets it to the new default for the current mode.
   */
  useEffect(() => {
    function handleTimerDefaultsChanged(e) {
      const detail = e?.detail;
      const mode = detail?.mode;
      const prevMinutes = Number(detail?.prevMinutes);
      const nextMinutes = Number(detail?.nextMinutes);

      if (!["work", "meeting", "break"].includes(mode) || !(nextMinutes > 0)) {
        return;
      }

      const s = stateRef.current;

      if (s.isRunning) return;
      if (s.mode !== mode) return;

      const isIdleLike =
        s.timeLeft === s.customMinutes * 60 || s.timeLeft === 0;

      const wasUsingOldDefault =
        Number.isFinite(prevMinutes) && s.customMinutes === prevMinutes;

      if (!isIdleLike && !wasUsingOldDefault) return;

      dispatch({ type: "RESET_TIMER", payload: { mode, minutes: nextMinutes } });
    }

    window.addEventListener("timerDefaultsChanged", handleTimerDefaultsChanged);

    return () => {
      window.removeEventListener(
        "timerDefaultsChanged",
        handleTimerDefaultsChanged,
      );
    };
  }, []);

  /**
   * Changes both the timer mode and its duration.
   *
   * @param {"work" | "meeting" | "break"} mode
   * @param {number} minutes
   */
  function setModeAndMinutes(mode, minutes) {
    dispatch({ type: "CHANGE_MODE", payload: mode });
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });
  }

  /**
   * Changes mode and applies that mode's saved default minutes.
   *
   * @param {"work" | "meeting" | "break"} mode
   */
  function setModeWithDefaults(mode) {
    const minutes = minutesForMode(mode);
    setModeAndMinutes(mode, minutes);
  }

  /**
   * Fully resets the timer using the saved default minutes for a mode.
   *
   * @param {"work" | "meeting" | "break"} mode
   */
  function resetToModeDefaults(mode) {
    const minutes = minutesForMode(mode);
    dispatch({ type: "RESET_TIMER", payload: { mode, minutes } });
  }

  /**
   * Applies a recommendation plan when the user navigates to /timer.
   *
   * The plan is consumed once and used to prefill the timer mode and minutes.
   */
  useEffect(() => {
    const onTimerRoute = location.pathname.startsWith("/timer");
    if (!onTimerRoute) return;

    const p = consumePlan();
    if (!p) return;

    const mode = p.timerMode;
    const minutes = Number(p.minutes);

    if (!["work", "meeting", "break"].includes(mode) || !(minutes > 0)) {
      return;
    }

    setModeAndMinutes(mode, minutes);
  }, [location.pathname, consumePlan]);

  /**
   * Memoized timer context API exposed to consumers.
   */
  const api = useMemo(
    () => ({
      state,
      isSessionPopupOpen,
      startTimer: () => dispatch({ type: "START_TIMER" }),
      pauseTimer: () => dispatch({ type: "PAUSE_TIMER" }),
      resetTimer: () => resetToModeDefaults("work"),
      setModeWithDefaults,
      setModeAndMinutes,
      endSession: () => {
        dispatch({ type: "PAUSE_TIMER" });
        setIsSessionPopupOpen(true);
      },
      closeSessionPopup: () => setIsSessionPopupOpen(false),
      openSessionPopup: () => setIsSessionPopupOpen(true),
    }),
    [state, isSessionPopupOpen],
  );

  return <TimerContext.Provider value={api}>{children}</TimerContext.Provider>;
}

/**
 * Hook for reading the timer context.
 *
 * Must be used inside <TimerProvider>.
 *
 * @returns {{
 *   state: object,
 *   isSessionPopupOpen: boolean,
 *   startTimer: () => void,
 *   pauseTimer: () => void,
 *   resetTimer: () => void,
 *   setModeWithDefaults: (mode: "work" | "meeting" | "break") => void,
 *   setModeAndMinutes: (mode: "work" | "meeting" | "break", minutes: number) => void,
 *   endSession: () => void,
 *   closeSessionPopup: () => void,
 *   openSessionPopup: () => void,
 * }}
 */
export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}