import { ToggleButtonGroup, ToggleButton, Box } from "../ui";

export default function EnergyLevelPicker({ value, onChange }) {
  return (
    <Box>
      <ToggleButtonGroup
        value={value}
        onChange={(_, v) => v != null && onChange(v)}
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {[1, 2, 3, 4, 5].map((num) => {
          const selected = value === num;

          return (
            <ToggleButton
              key={num}
              value={num}
              style={{
                minWidth: 48,
                minHeight: 44,
                borderRadius: 10,
                border: selected
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
                background: selected ? "var(--selected-bg)" : "transparent",
                color: selected ? "var(--accent)" : "var(--text)",
                fontWeight: 600,
              }}
            >
              {num}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
}
