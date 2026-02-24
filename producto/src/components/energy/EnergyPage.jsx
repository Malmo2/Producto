import { useMemo, useState } from "react";
import { useEnergy } from "./context/EnergyContext";
import EnergyLevelPicker from "./EnergyLevelPicker";
import EnergyGraph from "./EnergyGraph";
import EnergyLogList from "./EnergyLogList";
import EnergyStats from "./EnergyStats";
import { Box, Typography, Button, Card } from "../ui";

function EnergyPage() {
  const [energy, setEnergy] = useState(3);
  const { logs, addLog, deleteLog } = useEnergy();

  const average = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.level, 0);
    return sum / logs.length;
  }, [logs]);

  return (
    <Card style={{ padding: 20 }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Typography variant="h5" component="h2">
          Energy Level: {energy}
        </Typography>

        <EnergyLevelPicker value={energy} onChange={setEnergy} />

        <Button onClick={() => addLog(energy)}>Save energy</Button>

        <EnergyGraph logs={logs} />

        <EnergyLogList logs={logs} onDelete={deleteLog} />

        <EnergyStats average={average} />
      </Box>
    </Card>
  );
}

export default EnergyPage;
