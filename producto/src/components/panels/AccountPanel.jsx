import { useAuthActions, useAuthState } from "../../contexts/AuthContext";
import { Typography, Button, Box } from "../ui";

export function AccountPanel() {
  const { status, user } = useAuthState();
  const { logout } = useAuthActions();

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  if (status !== "authenticated") {
    return <Typography>Not logged in</Typography>;
  }

  return (
    <Box component="section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Typography variant="h5" component="h2">Account</Typography>
      <Typography variant="body1">
        Logged in as {user.name} ({user.email})
      </Typography>
      <Button variant="outlined" onClick={logout}>Logout</Button>
    </Box>
  );
}
