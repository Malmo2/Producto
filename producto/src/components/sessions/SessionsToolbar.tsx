import styles from "../nav/pages/Sessions.module.css";
import type { SessionsToolbarProps } from "./types";
import { Select, SelectOption, Typography, Box } from "../ui";

export default function SessionsToolbar({
    categories,
    categoryFilter,
    onCategoryChange,
    sortOrder,
    onSortChange,
    count,
}: SessionsToolbarProps) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.field}>
                <Select
                    label="Category"
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.currentTarget.value)}
                    className={styles.select}
                >
                    {categories.map((c) => (
                        <SelectOption key={c} value={c}>{c}</SelectOption>
                    ))}
                </Select>
            </div>

            <div className={styles.field}>
                <Select
                    label="Sort"
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.currentTarget.value as "asc" | "desc")}
                    className={styles.select}
                >
                    <SelectOption value="desc">Newest first</SelectOption>
                    <SelectOption value="asc">Oldest first</SelectOption>
                </Select>
            </div>

            <Typography variant="body2" className={styles.count}>
                {count} session{count === 1 ? "" : "s"}
            </Typography>
        </div>
    );
}