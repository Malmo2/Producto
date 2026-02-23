import { useState } from "react";
import { useSessions } from "../../../contexts/SessionContext";
import type { WorkSessions } from "../../sessions/types";
import styles from "./Sessions.module.css";

import SessionsHeader from "../../sessions/SessionsHeader";
import SessionsToolbar from "../../sessions/SessionsToolbar";
import SessionsEmptyState from "../../sessions/SessionsEmptyState";
import SessionsList from "../../sessions/SessionsList";

import { useFilteredSessions } from "../../../hooks/useFilteredSessions";
import { useCategories } from "../../../hooks/useCategories";

function Sessions() {
    const { sessions, deleteSession, clearSessions } = useSessions();
    const [categoryFilter, setCategoryFilter] = useState<string>("All");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    const categories = useCategories(sessions);
    const filteredSessions = useFilteredSessions(sessions, categoryFilter, sortOrder);

    return (
        <div className={styles.page}>
            <SessionsHeader onClearAll={clearSessions} disableClearAll={sessions.length === 0} />

            <SessionsToolbar
                categories={categories}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                sortOrder={sortOrder}
                onSortChange={setSortOrder}
                count={filteredSessions.length}
            />

            {sessions.length === 0 ? (
                <SessionsEmptyState />
            ) : (
                <SessionsList sessions={filteredSessions as WorkSessions[]} onDelete={deleteSession} />
            )}
        </div>
    );
}

export default Sessions;