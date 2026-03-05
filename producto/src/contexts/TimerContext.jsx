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

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state])

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

  useEffect(() => {
    function handleTimerDefaultsChanged(e) {
      const detail = e?.detail;
      const mode = detail?.mode;
      const prevMinutes = Number(detail?.prevMinutes);
      const nextMinutes = Number(detail?.nextMinutes);

      if (!["work", "meeting", "break"].includes(mode) || !(nextMinutes > 0)) return;

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
      window.removeEventListener("timerDefaultsChanged", handleTimerDefaultsChanged);
    }
  }, [])

  function setModeAndMinutes(mode, minutes) {
    dispatch({ type: "CHANGE_MODE", payload: mode });
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });
  }

  function setModeWithDefaults(mode) {
    const minutes = minutesForMode(mode);
    setModeAndMinutes(mode, minutes);
  }

  function resetToModeDefaults(mode) {
    const minutes = minutesForMode(mode);
    dispatch({ type: "RESET_TIMER", payload: { mode, minutes } });
  }



  useEffect(() => {
    const onTimerRoute = location.pathname.startsWith("/timer");
    if (!onTimerRoute) return;

    const p = consumePlan();
    if (!p) return;

    const mode = p.timerMode;
    const minutes = Number(p.minutes);

    if (!["work", "meeting", "break"].includes(mode) || !(minutes > 0)) return;

    setModeAndMinutes(mode, minutes);
  }, [location.pathname, consumePlan]);

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

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}
