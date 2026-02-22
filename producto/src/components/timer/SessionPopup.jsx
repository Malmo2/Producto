import Button from "../button/button";
import EnergyLevelPicker from "../energy/EnergyLevelPicker";
import { useState } from "react";
import { useEnergy } from "../energy/context/EnergyContext";

export default function SessionPopup({
  show,
  sessionTitle,
  sessionCategory,
  categories,
  onTitleChange,
  onCategoryChange,
  onSave,
  onCancel,
}) {
  const [energy, setEnergy] = useState(3);
  const { addLog } = useEnergy();

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Save your work session</h2>

        <div className="popup-field">
          <label>What did you work on?</label>
          <input
            type="text"
            value={sessionTitle}
            onChange={onTitleChange}
            placeholder="Fixed something.."
            autoFocus
          />
        </div>

        <div className="popup-field">
          <label>Category</label>
          <select value={sessionCategory} onChange={onCategoryChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Rate your energy level</p>
          <EnergyLevelPicker value={energy} onChange={setEnergy} />
        </div>

        <div className="popup-buttons">
          <Button
            onClick={() => {
              onSave?.(energy);
            }}
          >
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
