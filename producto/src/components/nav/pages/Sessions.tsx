import { useMemo, useState } from "react";
import { useSessions } from "../../../contexts/SessionContext";
import formatTime from "../../../utils/formatTime";
import Card from "../../cards/Card";
import Button from "../../button/button";
import styles from "./Sessions.module.css";

type WorkSession = {
    id: string | number;
    user_id?: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string | null;
    created_at?: string;
    duration: number; // seconds
    date: string;
    energy?: number; // 1-5 (optional for older sessions)
};

function Sessions() {
    const { sessions, deleteSession, clearSessions } = useSessions();
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const categories = useMemo(() => {
        const unique = new Set<string>(
            sessions.map((s: WorkSession) => s.category)
        );
        return ["All", ...Array.from(unique).sort()];
    }, [sessions]);

    const filteredSessions = useMemo(() => {
        return sessions
            .filter((s: WorkSession) =>
                categoryFilter === "All" ? true : s.category === categoryFilter
            )
            .sort((a: WorkSession, b: WorkSession) => {
                const aTime = new Date(a.startTime).getTime();
                const bTime = new Date(b.startTime).getTime();
                return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
            });
    }, [sessions, categoryFilter, sortOrder]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Sessions</h1>
                    <p className={styles.subtitle}>
                        Review and manage your saved work sessions.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={clearSessions}
                    disabled={sessions.length === 0}
                    className={styles.clearButton}
                >
                    Clear all
                </Button>
            </div>

            <div className={styles.toolbar}>
                <label className={styles.field}>
                    <span className={styles.labelText}>Category</span>
                    <select
                        className={styles.select}
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

                <label className={styles.field}>
                    <span className={styles.labelText}>Sort</span>
                    <select
                        className={styles.select}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.currentTarget.value as "asc" | "desc")}
                    >
                        <option value="desc">Newest first</option>
                        <option value="asc">Oldest first</option>
                    </select>
                </label>

                <div className={styles.count}>
                    {filteredSessions.length} session{filteredSessions.length === 1 ? "" : "s"}
                </div>
            </div>

            {sessions.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyTitle}>No sessions yet</div>
                    <div className={styles.emptyText}>
                        Start the timer on your dashboard and save a session to see it here.
                    </div>
                </div>
            ) : (
                <ul className={styles.list}>
                    {filteredSessions.map((s: WorkSession) => (
                        <li key={String(s.id)} className={styles.listItem}>
                            <Card
                                className={styles.sessionCard}
                                title={s.title}
                                titleClassName={styles.sessionTitle}
                            >
                                <div className={styles.sessionMetaRow}>
                                    <span className={styles.categoryPill}>{s.category}</span>
                                    <span className={styles.duration}>{formatTime(s.duration)}</span>
                                </div>

                                <div className={styles.sessionGrid}>
                                    <div className={styles.sessionField}>
                                        <span className={styles.sessionKey}>Date</span>
                                        <span className={styles.sessionValue}>{s.date}</span>
                                    </div>

                                    <div className={styles.sessionField}>
                                        <span className={styles.sessionKey}>Start</span>
                                        <span className={styles.sessionValue}>
                                            {new Date(s.startTime).toLocaleTimeString("sv-SE", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>

                                    <div className={styles.sessionField}>
                                        <span className={styles.sessionKey}>End</span>
                                        <span className={styles.sessionValue}>
                                            {s.endTime
                                                ? new Date(s.endTime).toLocaleTimeString("sv-SE", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "Running"}
                                        </span>
                                    </div>

                                    <div className={styles.sessionField}>
                                        <span className={styles.sessionKey}>Energy</span>
                                        <span className={styles.sessionValue}>
                                            {typeof s.energy === "number" ? s.energy : "-"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardActions}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => deleteSession(s.id)}
                                        className={styles.deleteButton}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Sessions;