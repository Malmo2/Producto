import { useMemo } from "react";

export function useCategories<T extends { category: string }>(sessions: T[]) {
    const categories = useMemo(() => {
        const unique = new Set<string>(sessions.map((s) => s.category));
        return ["All", ...Array.from(unique).sort()];
    }, [sessions]);

    return categories;
}