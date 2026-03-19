import { List, ListItem, ListItemText, Button } from "../ui";

export default function EnergyLogList({ logs, onDelete }) {
  return (
    <List
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--card)",
      }}
    >
      {logs.map((log, index) => (
        <ListItem
          key={log.id}
          style={{
            borderBottom:
              index === logs.length - 1 ? "none" : "1px solid var(--border)",
          }}
          secondaryAction={
            <Button
              variant="outlined"
              size="small"
              onClick={() => onDelete(log.id)}
              style={{
                borderColor: "rgba(239, 68, 68, 0.35)",
                color: "var(--error)",
              }}
            >
              Delete
            </Button>
          }
        >
          <ListItemText
            primary={`Energy: ${log.level}`}
            secondary={new Date(log.createdAt).toLocaleTimeString()}
          />
        </ListItem>
      ))}
    </List>
  );
}
