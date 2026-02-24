export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode-selector">
      <button
        className={mode === "work" ? "mode-btn active" : "mode-btn"}
        onClick={() => onModeChange("work")}
      >
        Work
      </button>

      <button
        className={mode === "break" ? "mode-btn active" : "mode-btn"}
        onClick={() => onModeChange("break")}
      >
        Break
      </button>

      <button
        className={mode === "meeting" ? "mode-btn active" : "mode-btn"}
        onClick={() => onModeChange("meeting")}
      >
        Meeting
      </button>
    </div>
  );
}
