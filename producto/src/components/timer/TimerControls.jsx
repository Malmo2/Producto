import Button from "../button/button";

export default function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
}) {
  return (
    <div className="timer-controls">
      {isRunning ? (
        <Button onClick={onPause}>Pause</Button>
      ) : (
        <Button onClick={onStart}>Start</Button>
      )}
      <Button onClick={onReset} disabled={!isRunning}>
        Reset
      </Button>
    </div>
  );
}
