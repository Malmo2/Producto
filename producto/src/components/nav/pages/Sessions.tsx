import { useEffect, useState } from "react"
import { useAuthState } from "../../../contexts/AuthContext"
import { apiFetch } from "../../../lib/api"

type WorkSession = {
    id: string;
    user_id: string;
    title: string;
    category: string;
    start_at: string;
    end_at: string | null;
    created_at: string;
};

function Sessions() {

    const { token } = useAuthState();
    const [sessions, setSessions] = useState<WorkSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">('desc');


    const categories = ["All", ...Array.from(new Set(sessions.map((s) => s.category))).sort()];

    const filteredSessions = sessions.filter((s) => categoryFilter === "All" ? true : s.category === categoryFilter)
        .sort((a, b) => {
            const aTime = new Date(a.start_at).getTime();
            const bTime = new Date(b.start_at).getTime();
            return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
        });

    useEffect(() => {
        if (!token) return;

        (async () => {
            try {
                setError("");
                setLoading(true);

                const data = await apiFetch("/api/sessions", token);
                setSessions(data.sessions ?? []);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const deleteSession = async (id: string) => {
        if (!token) return;

        try {
            setError("");
            await apiFetch(`/api/sessions/${id}`, token, { method: "DELETE" });

            setSessions((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        }
    }




    return (
        <div style={{ padding: 16 }}>
            <h2>Sessions</h2>

            {token && (
                <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                    <label>
                        Category:&nbsp;
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.currentTarget.value)}
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Sort:&nbsp;
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.currentTarget.value as "asc" | "desc")}
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </label>
                </div>
            )}


            {!token && <p>You must be logged in.</p>}

            {loading && token && <p>Loading...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && token && sessions.length === 0 && <p>No sessions yet.</p>}

            {!loading && token && filteredSessions.length > 0 && (
                <ul style={{ marginTop: 12 }}>
                    {filteredSessions.map((s) => (
                        <li key={s.id} style={{ marginBottom: 10 }}>

                            <div>
                                <strong>{s.title}</strong> - {s.category}
                            </div>

                            <div>
                                Start: {new Date(s.start_at).toLocaleString()}
                            </div>
                            <div>
                                End:{" "}
                                {s.end_at ? new Date(s.end_at).toLocaleString() : "Running (end_at is null)"}
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.8 }}>id: {s.id}</div>
                            <button onClick={() => deleteSession(s.id)} style={{ marginTop: 6 }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Sessions