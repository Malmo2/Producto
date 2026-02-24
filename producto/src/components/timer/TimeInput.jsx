export default function TimeInput({ customMinutes, isRunning, onChange, onKeyDown }) {
    const safeValue =
        customMinutes === "" || customMinutes == null
            ? ""
            : Number.isFinite(Number(customMinutes))
                ? String(customMinutes)
                : "";

    return (
        <div className="time-input">
            <input
                type="number"
                min={1}
                max={120}
                value={safeValue}
                placeholder="Enter time"
                disabled={isRunning}
                onChange={onChange}
                onKeyDown={onKeyDown}
            />
            <label>Minutes</label>
        </div>
    );
}