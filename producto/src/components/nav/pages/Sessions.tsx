import { useMemo, useState } from "react";
import { useSessions } from "../../../contexts/SessionContext";
import formatTime from "../../../utils/formatTime";
import Card from "../../cards/Card";


type WorkSession = {
    id: string;
    user_id?: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string | null;
    created_at?: string;
    duration: string;
    date: string;
};



function Sessions() {
    const { sessions, deleteSession, clearSessions } = useSessions();

    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const categories = useMemo(() => {
        const unique = new Set<string>(sessions.map((s: WorkSession) => s.category));
        return ["All", ...Array.from(unique).sort()];
    }, [sessions]);


    const filteredSessions = useMemo(() => {
        return sessions
            .filter((s: WorkSession) => (categoryFilter === "All" ? true : s.category === categoryFilter))
            .sort((a: WorkSession, b: WorkSession) => {
                const aTime = new Date(a.startTime).getTime();
                const bTime = new Date(b.startTime).getTime();
                return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
            });
    }, [sessions, categoryFilter, sortOrder]);




    return (
        // Layout Card
        <Card style={{ padding: 16 }}>
            <h2>Sessions</h2>

            <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
                <label>
                    Category:&nbsp;
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.currentTarget.value)}>
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

                <button onClick={clearSessions}>Clear all</button>
            </div>

            {sessions.length === 0 && <p style={{ marginTop: 12 }}>No sessions yet.</p>}

            {filteredSessions.length > 0 && (
                <ul style={{ marginTop: 12 }}>
                    {filteredSessions.map((s: WorkSession) => (
                        <li key={s.id} style={{ marginBottom: 10 }}>
                            <Card
                                title={s.title}
                            >
                                <div>
                                    <strong>{s.category}</strong>
                                </div>

                                <div>Date: {s.date}</div>
                                <div>Start: {new Date(s.startTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}</div>

                                <div>
                                    End: {s.endTime ? new Date(s.endTime).toLocaleString("sv-SE", { hour: "2-digit", minute: "2-digit" }) : "Running (endTime is null)"}
                                </div>

                                <div> Duration: {formatTime(s.duration)}</div>


                                <button onClick={() => deleteSession(s.id)} style={{ marginTop: 6 }}>
                                    Delete
                                </button>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

export default Sessions;