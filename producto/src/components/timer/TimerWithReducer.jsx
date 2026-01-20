import { useEffect, useReducer, useRef } from 'react';

import '../timer/timer.css';
import Button from '../button/button';

const WORK_SECONDS = 20 * 60;

const initialState = {
    timeLeft: WORK_SECONDS,
    isRunning: false,
};




function timerReducer(state, action) {
    switch (action.type) {
        case 'START':
            return { ...state, isRunning: true };

        case 'PAUSE':
            return { ...state, isRunning: false };

        case 'RESET':
            return { timeLeft: WORK_SECONDS, isRunning: false };

        case 'TICK':
            if (!state.isRunning) return state;
            if (state.timeLeft <= 1) {
                return { ...state, timeLeft: 0, isRunning: false };
            }
            return { ...state, timeLeft: state.timeLeft - 1 };

        default:
            return state;

    }

}


export default function TimerWithReducer() {

    const [state, dispatch] = useReducer(timerReducer, initialState);

    const intervalRef = useRef(null);

    useEffect(() => {

        if (state.isRunning) {
            intervalRef.current = setInterval(() => {
                dispatch({ type: 'TICK' })
            }, 1000)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state.isRunning])


    return (
        <div className="timer-container">
            <h2 className="timer-display">Timer: {state.timeLeft}</h2>



            <Button
                onClick={() => dispatch({ type: 'START' })}
                variant="purple"
                disabled={state.isRunning}

            >
                Start</Button>
            <Button
                onClick={() => dispatch({ type: 'PAUSE' })}
                variant="purple"
                disabled={!state.isRunning}

            >
                Pause</Button>
            <Button
                onClick={() => dispatch({ type: 'RESET' })}
                variant="purple"
            >
                Reset</Button>
        </div>
    );
}


