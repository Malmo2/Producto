import styles from "../nav/pages/Sessions.module.css";
import type { SessionsToolbarProps } from "./types";

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
            <label className={styles.field}>
                <span className={styles.labelText}>Category</span>
                <select
                    className={styles.select}
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.currentTarget.value)}
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
                    onChange={(e) => onSortChange(e.currentTarget.value as "asc" | "desc")}
                >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                </select>
            </label>

            <div className={styles.count}>
                {count} session{count === 1 ? "" : "s"}
            </div>
        </div>
    );
}