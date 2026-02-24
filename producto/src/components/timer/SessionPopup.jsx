import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, SelectOption, Typography, Box } from "../ui";
import EnergyLevelPicker from "../energy/EnergyLevelPicker";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (show) setEnergy(3);
  }, [show]);

  return (
    <Dialog open={show} onClose={onCancel}>
      <DialogTitle>Save your work session</DialogTitle>
      <DialogContent>
        <Box style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField
            label="What did you work on?"
            value={sessionTitle}
            onChange={onTitleChange}
            placeholder="Fixed something.."
            autoFocus
          />
          <Select label="Category" value={sessionCategory} onChange={onCategoryChange}>
            {categories.map((category) => (
              <SelectOption key={category} value={category}>
                {category}
              </SelectOption>
            ))}
          </Select>
          <Box>
            <Typography variant="body2" style={{ marginBottom: 8 }}>
              Rate your energy level
            </Typography>
            <EnergyLevelPicker value={energy} onChange={setEnergy} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSave?.(energy)}>Save</Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
