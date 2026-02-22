import styles from '../nav/pages/Sessions.module.css';

export default function SessionsEmptyState() {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No sessions yet</div>
            <div className={styles.emptyText}>
                Start the timer on your dashboard and save a session to see it here.
            </div>
        </div>
    );
}