import { useEffect, useReducer, useRef, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useAuthState } from "../../contexts/AuthContext";
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
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [startAt, setStartAt] = useState(null);
  const { token } = useAuthState();

  const handleStart = async () => {
    if (!token) return;
    if (state.isRunning) return;

    dispatch({ type: "START" });

    if (startAt) return;

    const start = new Date();
    setStartAt(start);

    try {
      const created = await apiFetch("/api/sessions", token, {
        method: "POST",
        body: JSON.stringify({
          title: "Timer session",
          category: "Deep Work",
          startAt: start.toISOString(),
          endAt: null,
        }),
      });

      setActiveSessionId(created.session.id);

    } catch (e) {
      dispatch({ type: "PAUSE" });
      setStartAt(null);
      setActiveSessionId(null);
      console.error(e);
    }
  };


  const handlePause = async () => {
    if (!token) return;
    if (!state.isRunning) return;

    dispatch({ type: "PAUSE" });

    if (!activeSessionId) {
      setStartAt(null)
      return;
    }

    try {
      await apiFetch(`/api/sessions/${activeSessionId}`, token, {
        method: "PUT",
        body: JSON.stringify({
          endAt: new Date().toISOString(),
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setStartAt(null);
      setActiveSessionId(null);
    }
  };


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
          onClick={handleStart}
          variant="purple"
          disabled={state.isRunning}
        >
          Start
        </Button>

        <Button
          onClick={handlePause}
          variant="purple"
          disabled={!state.isRunning}
        >
          Pause
        </Button>

        <Button
          onClick={async () => {
            if (state.isRunning) await handlePause();
            dispatch({ type: "RESET" });
          }}
          variant="purple"
        >
          Reset
        </Button>

      </div>
    </Card>
  );
}
