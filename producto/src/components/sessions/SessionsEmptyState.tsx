import styles from '../nav/pages/Sessions.module.css';
import { Typography, Box } from '../ui';

export default function SessionsEmptyState() {
    return (
        <Box className={styles.emptyState}>
            <Typography variant="h6" className={styles.emptyTitle}>No sessions yet</Typography>
            <Typography variant="body2" color="muted" className={styles.emptyText}>
                Start the timer on your dashboard and save a session to see it here.
            </Typography>
        </Box>
    );
}