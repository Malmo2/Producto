import { useEffect, useState } from "react";

function EnergyTest() {
  const [energy, setEnergy] = useState(3);

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("energyLogs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("energyLogs", JSON.stringify(logs));

    // tell other components that energi logs changed
    window.dispatchEvent(new Event("energyLogsUpdated"))
  }, [logs]);

  // Avergage energy
  // AVERAGE FORMULA!! average = sum of observation / total number of observation
  const average =
    logs.length === 0
      ? 0
      : logs.reduce((sum, log) => sum + log.level, 0) / logs.length;

  const deleteLog = (indexToDelete) => {
    setLogs(logs.filter((_, index) => index !== indexToDelete));
  };




  return (
    <div>
      {/* energy level buttons */}
      <h2>Energy Level: {energy}</h2>
      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setEnergy(num)}
            style={{
              padding: "8px 12px",
              fontWeight: energy === num ? "bold" : "normal",
              border: energy === num ? "2px solid black" : "1px solid #ccc",
              background: energy === num ? "#424242" : "#cccccc",
              cursor: "pointer",
              color: "black",
            }}
          >
            {num}
          </button>
        ))}
      </div>
      <button
        onClick={() =>
          setLogs([{ level: energy, createdAt: Date.now() }, ...logs])
        }
      >
        Save energy
      </button>

   
      {/* graph */}
      <h3>Energy graph (latest first)</h3>
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        {/* LEFT: Y-axis labels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 120,
            padding: "10px 0",
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          <div>5</div>
          <div>4</div>
          <div>3</div>
          <div>2</div>
          <div>1</div>
        </div>

        {/* RIGHT: Bars */}
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-end",
            height: 120,
            padding: 10,
            border: "1px solid #646464",
            borderRadius: 8,
            overflowX: "auto",
            flex: 1,
          }}
        >
          {logs.slice(0, 10).map((log, index) => (
            <div
              key={index}
              title={`Energy ${log.level}`}
              style={{
                width: 20,
                height: log.level * 20,
                background: "black",
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      </div>
      {/* energy ul */}
      <ul>
        {logs.map((log, index) => {
          return (
            <li key={index}>
              Energy: {log.level} - {" "}
              {new Date(log.createdAt).toLocaleTimeString()}
              {/* delete button */}
              <button
                onClick={() => deleteLog(index)}
                style={{ marginLeft: 8 }}
              >
                Ta bord
              </button>
            </li>
          );
        })}
      </ul>
      <p>Average energy: {average.toFixed(2)}</p>
      {/* toFixed is for the decimals */}
    </div>
  );
}

export default EnergyTest;
