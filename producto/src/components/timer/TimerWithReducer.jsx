import { useEffect, useReducer, useRef } from "react";
import formatTime from "../../utils/formatTime";
import timerStyles from "./TimerReducer.module.css";
import Button from "../button/button";
import Circle from "../../utils/circle";
import Card from "../cards/Card";

const WORK_SECONDS = 20 * 60;

const initialState = {
  timeLeft: WORK_SECONDS,
  isRunning: false,
};

function timerReducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...state, isRunning: true };

    case "PAUSE":
      return { ...state, isRunning: false };

    case "RESET":
      return { timeLeft: WORK_SECONDS, isRunning: false };

    case "TICK":
      if (!state.isRunning) return state;
      if (state.timeLeft <= 1) return { ...state, timeLeft: 0, isRunning: false };
      return { ...state, timeLeft: state.timeLeft - 1 };

    default:
      return state;
  }
}

export default function TimerWithReducer() {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning]);

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 320,
        margin: "0 auto",
        padding: 16,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        boxSizing: "border-box",
        background: "#162238",
      }}
    >
      <div className={timerStyles.ringWrap}>
        <Circle timeLeft={state.timeLeft} totalSeconds={WORK_SECONDS}>
          <div className={timerStyles.ringTime}>{formatTime(state.timeLeft)}</div>
          <div className={timerStyles.ringLabel}>
            {state.isRunning ? "Running" : "Paused"}
          </div>
        </Circle>
      </div>

      <div className={timerStyles.timerControls}>
        <Button
          onClick={() => dispatch({ type: "START" })}
          variant="purple"
          disabled={state.isRunning}
        >
          Start
        </Button>

        <Button
          onClick={() => dispatch({ type: "PAUSE" })}
          variant="purple"
          disabled={!state.isRunning}
        >
          Pause
        </Button>

        <Button onClick={() => dispatch({ type: "RESET" })} variant="purple">
          Reset
        </Button>
      </div>
    </Card>
  );
}
