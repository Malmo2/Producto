export default function EnergyLevelPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          style={{
            padding: "8px 12px",
            fontWeight: value === num ? "bold" : "normal",
            border: value === num ? "2px solid black" : "1px solid #ccc",
            background: value === num ? "#424242" : "#cccccc",
            cursor: "pointer",
            color: "black",
          }}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
