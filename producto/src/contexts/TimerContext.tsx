import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { timerReducer, initialTimerState } from "../components/timer/timerReducer"

type TimerMode = "work" | "meeting" | "break";

type TimerState = {
    mode: TimerMode;
    customMinutes: number | "";
    timeLeft: number;
    isRunning: boolean;
    startTime: Date | string | null;
    [key: string]: unknown;
};

type TimerAction =
    | { type: "TIMER_TICK" }
    | { type: "START_TIMER" }
    | { type: "PAUSE_TIMER" }
    | { type: "RESET_TIMER" }
    | { type: "CHANGE_MODE"; payload: TimerMode }
    | { type: "SET_CUSTOM_MINUTES"; payload: number | "" };

type TimerContextValue = {
    state: TimerState;
    dispatch: React.Dispatch<TimerAction>;
};

const TimerContext = createContext<TimerContextValue | null>(null);

function initTimerState(): TimerState {
    const saved = localStorage.getItem("customMinutes");
    const customMinutes = saved ? Number(saved) : "";
    return {
        ...(initialTimerState as TimerState),
        customMinutes,
        timeLeft: customMinutes !== "" ? customMinutes * 60 : 0,
    };
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(
        timerReducer as React.Reducer<TimerState, TimerAction>,
        null as unknown as TimerState,
        initTimerState
    );

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (state.isRunning && state.timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                dispatch({ type: "TIMER_TICK" });
            }, 1000);
        }

        if (state.isRunning && state.timeLeft === 0) {
            dispatch({ type: "PAUSE_TIMER" });
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [state.isRunning, state.timeLeft]);

    const value = useMemo<TimerContextValue>(() => ({ state, dispatch }), [state]);

    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer(): TimerContextValue {
    const ctx = useContext(TimerContext);
    if (!ctx) throw new Error("useTimer must be used inside <TimerProvider />");
    return ctx;
}