import type { ReactNode } from "react";
import { createContext, useContext, useReducer, useState, useRef, useEffect } from "react";
import { timerReducer, initialTimerState } from "../timerReducer";

type TimerMode = "work" | "meeting" | "break";

type TimerState = {
  timeLeft: number;
  isRunning: boolean;
  customMinutes: number;
  startTime: string | null;
  endTime: string | null;
  mode: TimerMode;
};

type TimerContextValue = {
  state: TimerState;
  isSessionPopupOpen: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setModeWithDefaults: (mode: TimerMode) => void;
  setModeAndMinutes: (mode: TimerMode, minutes: number) => void;
  endSession: () => void;
  closeSessionPopup: () => void;
  openSessionPopup: () => void;
};

const TimerContext = createContext<TimerContextValue | null>(null);

const TIMER_DEFAULTS_FALLBACK: Record<TimerMode, number> = {
  work: 15,
  meeting: 45,
  break: 5,
};

function minutesForMode(mode: TimerMode) {
  return TIMER_DEFAULTS_FALLBACK[mode];
}

type TimerProviderProps = {
  children: ReactNode;
};

export function TimerProvider({ children }: TimerProviderProps) {
  const [state, dispatch] = useReducer(timerReducer, {
    ...initialTimerState,
    customMinutes: 15,
    timeLeft: minutesForMode("work") * 60,
    endTime: null,
    mode: "work",
  } as TimerState);

  const [isSessionPopupOpen, setIsSessionPopupOpen] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTimeLeftRef = useRef(state.timeLeft);

  useEffect(() => {
    if (!state.isRunning) return;

    intervalRef.current = setInterval(() => {
      dispatch({ type: "TIMER_TICK" });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      };
    }
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

  }, [state.timeLeft, state.startTime])

  function setModeAndMinutes(mode: TimerMode, minutes: number) {
    dispatch({ type: "CHANGE_MODE", payload: mode });
    dispatch({ type: "SET_CUSTOM_MINUTES", payload: minutes });
  }

  function setModeWithDefaults(mode: TimerMode) {
    const minutes = minutesForMode(mode);
    setModeAndMinutes(mode, minutes);
  }

  function resetToModeDefaults(mode: TimerMode) {
    const minutes = minutesForMode(mode);
    dispatch({ type: "RESET_TIMER", payload: { mode, minutes } });
  }

  const value: TimerContextValue = {
    state,
    isSessionPopupOpen,
    startTimer: () => dispatch({ type: "START_TIMER" }),
    pauseTimer: () => dispatch({ type: "PAUSE_TIMER" }),
    resetTimer: () => resetToModeDefaults(state.mode),
    setModeWithDefaults,
    setModeAndMinutes,
    endSession: () => {
      dispatch({ type: "PAUSE_TIMER" });
      setIsSessionPopupOpen(true);
    },
    closeSessionPopup: () => setIsSessionPopupOpen(false),
    openSessionPopup: () => setIsSessionPopupOpen(true),
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const ctx = useContext(TimerContext);

  if (!ctx) {
    throw new Error("useTimer must be used inside TimerProvider");
  }

  return ctx;
}