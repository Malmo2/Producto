import { useEffect, useState } from "react";
import { useAuthState } from "../../../contexts/AuthContext";
import { apiFetch } from "../../../lib/api";
import { Button, Typography, Box } from "../../ui";

type WorkSession = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  start_at: string;
  end_at: string | null;
  created_at: string;
};

function Projects() {
  const { token } = useAuthState();
  const [me, setMe] = useState<any>(null);
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [error, setError] = useState<string>("");

  const loadSessions = async () => {
    if (!token) return;
    const data = await apiFetch("/api/sessions", token);
    setSessions(data.sessions ?? []);
  };



  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const meData = await apiFetch("/api/me", token);
        setMe(meData);
        await loadSessions();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    })();
  }, [token]);

  const createTestSession = async () => {
    if (!token) return;

    try {
      await apiFetch("/api/sessions", token, {
        method: "POST",
        body: JSON.stringify({
          title: "Project test session",
          category: "Deep Work",
          startAt: new Date().toISOString(),
          endAt: null,
        }),
      });

      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const closeFirstSession = async () => {
    if (!token) return;
    if (sessions.length === 0) return;


    const first = sessions[0];

    try {
      console.log("PUT id:", first.id);
      console.log('First session from state:', sessions[0]);
      await apiFetch(`/api/sessions/${first.id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          endAt: new Date().toISOString(),
        }),
      });

      await loadSessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  }

  return (
    <Box style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <Typography variant="h5" component="h1">Youre on the Projects page.</Typography>

      {!token && <Typography color="muted">No token yet (log in first).</Typography>}

      {token && (
        <Box style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Button onClick={createTestSession}>Create test session</Button>
          <Button variant="outlined" onClick={closeFirstSession} disabled={!token || sessions.length === 0}>
            Close first session (set endAt)
          </Button>
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Box style={{ marginTop: 16 }}>
        <Typography variant="h6" component="h3">/api/me</Typography>
        <pre>{JSON.stringify(me, null, 2)}</pre>
      </Box>

      <Box style={{ marginTop: 16 }}>
        <Typography variant="h6" component="h3">/api/sessions</Typography>
        <pre>{JSON.stringify(sessions, null, 2)}</pre>
      </Box>
    </Box>
  );
}

export default Projects;
