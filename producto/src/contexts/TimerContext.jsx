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

const TimerContext = createContext(null);

const TIMER_DEFAULTS_KEY = "timerDefaults";
const TIMER_START_INTENT_KEY = "timerStartIntent";
const TIMER_SNAPSHOT_KEY = "timerSnapshotV1";
const TIMER_DEFAULTS_FALLBACK = { work: 15, meeting: 45, break: 5 };

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

function minutesForMode(mode) {
  const defaults = readTimerDefaults();
  const n = Number(defaults?.[mode]);
  return n > 0 ? n : TIMER_DEFAULTS_FALLBACK.work;
}

function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildInitialState() {
  const snapRaw = localStorage.getItem(TIMER_SNAPSHOT_KEY);
  const snap = snapRaw ? safeParseJson(snapRaw) : null;

  const snapModeCandidate = snap?.mode;
  const modeCandidate = ["work", "meeting", "break"].includes(snapModeCandidate)
    ? snapModeCandidate
    : initialTimerState.mode;

  const defaultMinutesForMode = minutesForMode(modeCandidate);

  const snapMinutesCandidate = Number(snap?.customMinutes);
  const snapMinutes =
    Number.isFinite(snapMinutesCandidate) && snapMinutesCandidate > 0
      ? snapMinutesCandidate
      : defaultMinutesForMode;

  const base = {
    ...initialTimerState,
    mode: modeCandidate,
    customMinutes: defaultMinutesForMode,
  };

  if (!snap) {
    return {
      ...base,
      timeLeft: defaultMinutesForMode > 0 ? defaultMinutesForMode * 60 : 0,
    };
  }

  const mode = ["work", "meeting", "break"].includes(snap.mode)
    ? snap.mode
    : base.mode;

  const startTime = typeof snap.startTime === "string" ? snap.startTime : null;
  const endTime = typeof snap.endTime === "string" ? snap.endTime : null;
  const isRunning = Boolean(snap.isRunning);

  let timeLeft = Number(snap.timeLeft);
  if (!Number.isFinite(timeLeft) || timeLeft < 0) timeLeft = 0;

  if (isRunning && endTime) {
    const endMs = new Date(endTime).getTime();
    const nowMs = Date.now();
    timeLeft = Math.max(0, Math.ceil((endMs - nowMs) / 1000));
  }

  const reallyRunning = isRunning && timeLeft > 0;

  const hasSession = Boolean(startTime);
  const isIdle = !reallyRunning && !hasSession;
  const idleMinutes = minutesForMode(mode);

  return {
    ...base,
    mode,
    customMinutes: isIdle ? idleMinutes : snapMinutes,
    startTime,
    endTime: reallyRunning ? endTime : null,
    isRunning: reallyRunning,
    timeLeft: isIdle ? idleMinutes * 60 : timeLeft,
  };
}

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

export function TimerProvider({ children }) {
  const { plan, clearPlan } = useRecommendationPlan();

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

  function setModeAndMinutes(mode, minutes) {
    dispatch({ type: "CHANGE_MODE", payload: mode });
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });

    localStorage.setItem("customMinutes", String(minutes));
    window.dispatchEvent(new Event("customMinutesChanged"));
  }

  function setModeWithDefaults(mode) {
    const minutes = minutesForMode(mode);
    setModeAndMinutes(mode, minutes);
  }

  useEffect(() => {
    if (!plan) return;

    const mode = plan.timerMode;
    const minutes = Number(plan.minutes);

    if (!["work", "meeting", "break"].includes(mode) || !(minutes > 0)) {
      clearPlan();
      return;
    }

    setModeAndMinutes(mode, minutes);
    clearPlan();
  }, [plan, clearPlan]);

  useEffect(() => {
    const raw = localStorage.getItem(TIMER_START_INTENT_KEY);
    if (!raw) return;

    const intent = safeParseJson(raw);

    try {
      const mode = intent?.mode;
      const minutes = Number(intent?.minutes);

      if (!["work", "meeting", "break"].includes(mode) || !(minutes > 0))
        return;

      setModeAndMinutes(mode, minutes);
      dispatch({ type: "START_TIMER" });
    } finally {
      localStorage.removeItem(TIMER_START_INTENT_KEY);
    }
  }, []);

  const api = useMemo(
    () => ({
      state,
      isSessionPopupOpen,
      startTimer: () => dispatch({ type: "START_TIMER" }),
      pauseTimer: () => dispatch({ type: "PAUSE_TIMER" }),
      resetTimer: () => dispatch({ type: "RESET_TIMER" }),
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

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}
