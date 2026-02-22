import Button from "../button/button";
import styles from "../nav/pages/Sessions.module.css";
import type { SessionsHeaderProps } from "./types";

export default function SessionsHeader({
    onClearAll,
    disableClearAll,
}: SessionsHeaderProps) {
    return (
        <div className={styles.header}>
            <div>
                <h1 className={styles.title}>Sessions</h1>
                <p className={styles.subtitle}>Review and manage your saved work sessions.</p>
            </div>

            <Button
                type="button"
                variant="secondary"
                onClick={onClearAll}
                disabled={disableClearAll}
                className={styles.clearButton}
            >
                Clear all
            </Button>
        </div>
    );
}