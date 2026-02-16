export default function EnergyGraph({ logs }) {
  const visible = logs.slice(0, 10);

  return (
    <>
      <h3>Energy graph (latest first)</h3>

      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
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
          {visible.map((log) => (
            <div
              key={log.id}
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
    </>
  );
}
