export type WorkSessions = {
    id: string | number;
    user_id?: string;
    title: string;
    category: string;
    startTime: string;
    endTime: string | null;
    created_at?: string;
    duration: number;
    date: string;
    energy?: number;
};

export type SessionsHeaderProps = {
    onClearAll: () => void;
    disableClearAll: boolean;
};

export type SessionsToolbarProps = {
    categories: string[];
    categoryFilter: string;
    onCategoryChange: (value: string) => void;
    sortOrder: "desc" | "asc";
    onSortChange: (value: "desc" | "asc") => void;
    count: number;
};

export type SessionCardItemProps = {
    session: WorkSessions;
    onDelete: (id: string | number) => void;
};

export type SessionsListProps = {
    sessions: WorkSessions[];
    onDelete: (id: string | number) => void;
};
