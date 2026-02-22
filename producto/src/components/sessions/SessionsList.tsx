import styles from '../nav/pages/Sessions.module.css';
import type { SessionsListProps } from './types';
import SessionCardItem from './SessionsCardItem';

export default function SessionsList({ sessions, onDelete }: SessionsListProps) {
    return (
        <ul className={styles.list}>
            {sessions.map((s) => (
                <SessionCardItem key={String(s.id)} session={s} onDelete={onDelete} />
            ))}
        </ul>
    );
}

