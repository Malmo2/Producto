import { useMemo, useState } from "react";
import { useEnergy } from "./context/EnergyContext";
import EnergyLevelPicker from "./EnergyLevelPicker";
import EnergyGraph from "./EnergyGraph";
import EnergyLogList from "./EnergyLogList";
import EnergyStats from "./EnergyStats";

function EnergyPage() {
  const [energy, setEnergy] = useState(3);
  const {logs, addLog, deleteLog} = useEnergy();

  const average = useMemo(() => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.level, 0);
    return sum / logs.length;
  }, [logs]);


  return (
    <div>
        <h2>Energy Level: {energy}</h2>

        <EnergyLevelPicker value={energy} onChange={setEnergy} />

        <button onClick={() => addLog(energy)}>Save energy</button>

        <EnergyGraph logs={logs} />

        <EnergyLogList logs={logs} onDelete={deleteLog} />

        <EnergyStats average={average} />
        
    </div>
  )
}

export default EnergyPage;
