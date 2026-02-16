import Button from "../button/button";

export default function SessionsList({ sessions, onDelete, onClearAll }) {
  if (sessions.length === 0) return null;

  return (
    <div className="sessions-list">
      <h3>Completed Sessions</h3>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <div>
              <strong>{session.title}</strong>
              <span className="session-category"> ({session.category})</span>
            </div>
            <div className="session-info">
              <span>{session.date}</span>
              <span> • {Math.floor(session.duration / 60)} min</span>
              <button
                className="delete-btn"
                onClick={() => onDelete(session.id)}
                title="Delete session"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Button onClick={onClearAll}>Clear history</Button>
    </div>
  );
}
