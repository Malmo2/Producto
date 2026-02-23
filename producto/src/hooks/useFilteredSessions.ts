import { useMemo } from "react";

type SortOrder = "asc" | "desc";

export function useFilteredSessions<T extends { category: string; startTime: string }>(
    sessions: T[],
    categoryFilter: string,
    sortOrder: SortOrder
) {
    const filteredSessions = useMemo(() => {
        return sessions
            .filter((s) => (categoryFilter === "All" ? true : s.category === categoryFilter))
            .sort((a, b) => {
                const aTime = new Date(a.startTime).getTime();
                const bTime = new Date(b.startTime).getTime();
                return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
            });


    }, [sessions, categoryFilter, sortOrder]);

    return filteredSessions;
}