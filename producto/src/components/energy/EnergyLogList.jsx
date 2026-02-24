import { List, ListItem, ListItemText, Button } from "../ui";

export default function EnergyLogList({ logs, onDelete }) {
  return (
    <List>
      {logs.map((log) => (
        <ListItem key={log.id} secondaryAction={
          <Button variant="outlined" size="small" onClick={() => onDelete(log.id)}>
            Ta bort
          </Button>
        }>
          <ListItemText
            primary={`Energy: ${log.level}`}
            secondary={new Date(log.createdAt).toLocaleTimeString()}
          />
        </ListItem>
      ))}
    </List>
  );
}