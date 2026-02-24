import { useEffect, useState } from "react";
import { useAuthState } from "../../../contexts/AuthContext";
import { apiFetch } from "../../../lib/api";

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
    const data = await apiFetch("/api/sessions");
    setSessions(data.sessions ?? []);
  };



  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const meData = await apiFetch("/api/me");
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
      await apiFetch("/api/sessions", {
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
      await apiFetch(`/api/sessions/${first.id}`, {
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
    <>
      <h1>Youre on the Projects page.</h1>

      {!token && <p>No token yet (log in first).</p>}

      {token && (
        <div style={{ marginTop: 12 }}>
          <button onClick={createTestSession}>Create test session</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={closeFirstSession} disabled={!token || sessions.length === 0}>
        Close first session (set endAt)
      </button>


      <div style={{ marginTop: 16 }}>
        <h3>/api/me</h3>
        <pre>{JSON.stringify(me, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>/api/sessions</h3>
        <pre>{JSON.stringify(sessions, null, 2)}</pre>
      </div>
    </>
  );
}

export default Projects;
