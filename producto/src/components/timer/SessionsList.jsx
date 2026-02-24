import { Button, IconButton, Typography, Box } from "../ui";

export default function SessionsList({ sessions, onDelete, onClearAll }) {
  if (sessions.length === 0) return null;

  return (
    <Box className="sessions-list">
      <Typography variant="h6" component="h3">Completed Sessions</Typography>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <Box>
              <Typography variant="subtitle1" component="strong">{session.title}</Typography>
              <Typography variant="body2" color="muted" component="span" className="session-category">
                {" "}({session.category})
              </Typography>
            </Box>
            <Box className="session-info" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Typography variant="body2">{session.date}</Typography>
              <Typography variant="body2" color="muted">• {Math.floor(session.duration / 60)} min</Typography>
              <IconButton
                className="delete-btn"
                onClick={() => onDelete(session.id)}
                aria-label="Delete session"
              >
                ✕
              </IconButton>
            </Box>
          </li>
        ))}
      </ul>
      <Button onClick={onClearAll}>Clear history</Button>
    </Box>
  );
}
