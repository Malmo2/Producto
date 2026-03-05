import { toSafeMinutes } from "../../utils/toSafeMinutes";
import { secondsUntil } from "../../utils/secondsUntil";

export const initialTimerState = {
  timeLeft: 0,
  isRunning: false,
  customMinutes: "",
  startTime: null,
  mode: "work",
};

export function timerReducer(state, action) {
  switch (action.type) {
    case "START_TIMER": {
      const baseTimeLeft = state.timeLeft;
      if (!(baseTimeLeft > 0)) return state;
      const nowIso = new Date().toISOString();
      const endIso = new Date(Date.now() + baseTimeLeft * 1000).toISOString();

      return {
        ...state,
        isRunning: true,
        startTime: state.startTime ?? nowIso,
        endTime: endIso,
      };
    }

    case "PAUSE_TIMER": {
      if (!state.isRunning) return state;
      const nextLeft = secondsUntil(state.endTime);
      return {
        ...state,
        isRunning: false,
        timeLeft: nextLeft,
        endTime: null,
      };
    }

    case "RESET_TIMER": {
      const nextMode = action?.payload.mode ?? state.mode;
      const nextMinutesRaw = action?.payload?.minutes ?? state.customMinutes;
      const minutes = toSafeMinutes(nextMinutesRaw);
      return {
        ...state,
        mode: nextMode,
        customMinutes: minutes,
        isRunning: false,
        startTime: null,
        endTime: null,
        timeLeft: minutes > 0 ? minutes * 60 : 0,
      };
    }

    case "TIMER_TICK": {
      if (!state.isRunning) return state;
      const nextLeft = secondsUntil(state.endTime);
      return {
        ...state,
        timeLeft: nextLeft,
      };
    }

    case "SET_CUSTOM_MINUTES": {
      const minutes = toSafeMinutes(action.payload);
      const nextTimeLeft = state.isRunning ? state.timeLeft : minutes * 60;

      return {
        ...state,
        customMinutes: action.payload,
        timeLeft: nextTimeLeft,
      };
    }

    case "CHANGE_MODE":
      return {
        ...state,
        mode: action.payload,
      };

    default:
      return state;
  }
}
