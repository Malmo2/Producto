
import styles from './rightpanel.module.css'

export default function RightPanel({ children }) {
    return (
        <div className={styles.rightPanel}>
            {children}
        </div>
    );
}