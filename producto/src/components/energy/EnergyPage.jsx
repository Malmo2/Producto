import { useMemo, useState } from "react";
import { useEnergy } from "./context/EnergyContext";
import EnergyLevelPicker from "./EnergyLevelPicker";
import EnergyLogList from "./EnergyLogList";
import EnergyStats from "./EnergyStats";
import EnergyGraph from "./EnergyGraph";
import { Box, Typography, Button, Card } from "../ui";
import { getEnergyTrend } from "../../utils/getEnergyTrend";
import { exportEnergyLogsCsv } from "../../utils/exportEnergyLogsCsv";

function EnergyPage() {
  const [energy, setEnergy] = useState(3);
  const { logs, addLog, deleteLog } = useEnergy();

  const average = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.level, 0);
    return sum / logs.length;
  }, [logs]);

  const latestEnergy = logs[0]?.level ?? null;

  const trend = useMemo(() => {
    return getEnergyTrend(logs, 6);
  }, [logs]);

  const handleExport = () => {
    exportEnergyLogsCsv(logs);
  };

  return (
    <Card style={{ padding: 20 }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Typography variant="h5" component="h2">
          Energy Tracker
        </Typography>

        <Typography variant="body1" color="muted">
          Log how you feel, track your pattern, and export your history.
        </Typography>

        <div
          style={{
            border: "1px solid var(--border-color, #d0d7de)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Typography variant="h6" component="h3">
            Quick insight
          </Typography>
          <Typography variant="body1" color="muted">
            Current energy: {latestEnergy ?? "No data"}
          </Typography>
          <Typography variant="body1" color="muted">
            Average energy: {average.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="muted">
            Trend: {trend}
          </Typography>
          <Typography variant="body1" color="muted">
            Entries: {logs.length}
          </Typography>
        </div>

        <Typography variant="h6" component="h3">
          Energy Level: {energy}
        </Typography>

        <EnergyLevelPicker value={energy} onChange={setEnergy} />

        <Box style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button onClick={() => addLog(energy)}>Save energy</Button>
          <Button variant="outlined" onClick={handleExport}>
            Export CSV
          </Button>
        </Box>

        <EnergyGraph logs={logs} />

        <EnergyLogList logs={logs} onDelete={deleteLog} />

        <EnergyStats average={average} />
      </Box>
    </Card>
  );
}

export default EnergyPage;
