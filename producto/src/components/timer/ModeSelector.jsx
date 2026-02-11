export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode-selector">
      <button
        className={mode === "work" ? "mode-btn active" : "mode-btn"}
        onClick={() => onModeChange("work")}
      >
        Work (50min)
      </button>

      <button
        className={mode === "break" ? "mode-btn active" : "mode-btn"}
        onClick={() => onModeChange("break")}
      >
        Break (15min)
      </button>
    </div>
  );
}
