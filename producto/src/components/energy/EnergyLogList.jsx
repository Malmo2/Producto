export default function EnergyLogList({ logs, onDelete }) {
  return (
    <ul>
      {logs.map((log) => (
        <li key={log.id}>
          Energy: {log.level} — {new Date(log.createdAt).toLocaleTimeString()}
          <button onClick={() => onDelete(log.id)} style={{ marginLeft: 8 }}>
            Ta bort
          </button>
        </li>
      ))}
    </ul>
  );
}