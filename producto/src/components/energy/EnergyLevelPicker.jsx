import { ToggleButtonGroup, ToggleButton, Box } from "../ui";

export default function EnergyLevelPicker({ value, onChange }) {
  return (
    <ToggleButtonGroup value={value} onChange={(_, v) => v != null && onChange(v)}>
      {[1, 2, 3, 4, 5].map((num) => (
        <ToggleButton key={num} value={num}>
          {num}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
