import formatTime from "../../utils/formatTime";
import Card from "../cards/Card";
import Button from "../button/button";
import styles from '../nav/pages/Sessions.module.css';
import type { SessionCardItemProps } from './types';

export default function SessionCardItem({ session, onDelete }: SessionCardItemProps) {

    const s = session;

    return (
        <li className={styles.listItem}>
            <Card className={styles.sessionCard} title={s.title} titleClassName={styles.sessionTitle}>
                <div className={styles.sessionMetaRow}>
                    <span className={styles.categoryPill}>{s.category}</span>
                    <span className={styles.duration}>{formatTime(s.duration)}</span>
                </div>

                <div className={styles.sessionGrid}>
                    <div className={styles.sessionField}>
                        <span className={styles.sessionKey}>Date</span>
                        <span className={styles.sessionValue}>{s.date}</span>
                    </div>

                    <div className={styles.sessionField}>
                        <span className={styles.sessionKey}>Start</span>
                        <span className={styles.sessionValue}>
                            {new Date(s.startTime).toLocaleTimeString("sv-SE", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>

                    <div className={styles.sessionField}>
                        <span className={styles.sessionKey}>End</span>
                        <span className={styles.sessionValue}>
                            {s.endTime
                                ? new Date(s.endTime).toLocaleTimeString("sv-SE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "Running"}
                        </span>
                    </div>

                    <div className={styles.sessionField}>
                        <span className={styles.sessionKey}>Energy</span>
                        <span className={styles.sessionValue}>
                            {typeof s.energy === "number" ? s.energy : "-"}
                        </span>
                    </div>
                </div>

                <div className={styles.cardActions}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onDelete(s.id)}
                        className={styles.deleteButton}
                    >
                        Delete
                    </Button>
                </div>
            </Card>
        </li>
    );
}