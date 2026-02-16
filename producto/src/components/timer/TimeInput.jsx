export default function TimeInput({ customMinutes, isRunning, onChange }) {
  return (
    <div className="time-input">
      <input
        type="number"
        min="1"
        max="120"
        value={customMinutes}
        placeholder="Enter time"
        disabled={isRunning}
        onChange={onChange}
      />
      <label>Minutes</label>
    </div>
  );
}
