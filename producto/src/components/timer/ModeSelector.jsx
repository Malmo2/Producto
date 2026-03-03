import { FaBriefcase, FaUsers, FaCoffee } from "react-icons/fa";
import { ToggleButtonGroup, ToggleButton } from "../ui";

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <ToggleButtonGroup
      value={mode}
      onChange={(_, v) => v != null && onModeChange(v)}
      ariaLabel="Timer mode"
      style={{
        flexWrap: "wrap",
        justifyContent: "center",
        width: "fit-content",
        margin: "0 auto 1.5rem",
      }}
    >
      <ToggleButton value="work">
        <FaBriefcase size={16} /> Work
      </ToggleButton>
      <ToggleButton value="meeting">
        <FaUsers size={16} /> Meeting
      </ToggleButton>
      <ToggleButton value="break">
        <FaCoffee size={16} /> Break
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
