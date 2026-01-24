
import styles from './rightpanel.module.css'

export default function RightPanel({ children }) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.panelBox}>{children}</div>
        </div >
    );
}