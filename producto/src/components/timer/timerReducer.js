export const initialTimerState = {
  timeLeft: 0,
  isRunning: false,
  customMinutes: "",
  startTime: null,
  mode: "work",
};

export function timerReducer(state, action) {
  switch (action.type) {
    case "START_TIMER":
      return {
        ...state,
        isRunning: true,
        startTime: state.startTime ? state.startTime : new Date(), //if startTime excists, use state.startTime else New Date()
      };

    case "PAUSE_TIMER":
      return {
        ...state,
        isRunning: false,
      };

    case "RESET_TIMER":
      return {
        ...state,
        isRunning: false,
        startTime: null,
        timeLeft: state.customMinutes !== "" ? state.customMinutes * 60 : 0,
      };

    case "TIMER_TICK":
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };

    case "SET_CUSTOM_MINUTES":
      return {
        ...state,
        customMinutes: action.payload,
        timeLeft: action.payload !== "" ? action.payload * 60 : 0,
      };

    case "CHANGE_MODE":
      return {
        ...state,
        mode: action.payload,
        isRunning: false,
        startTime: null,
      };

    default:
      return state;
  }
}
