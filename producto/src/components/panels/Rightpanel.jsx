
import styles from './rightpanel.module.css'

export default function RightPanel({ children }) {
    return (
        <div className={styles.rightPanel}>
            <div className={styles.panelBox}>{children}</div>
        </div >
    );
}

/// Möjligtvis ha stylingen i dashboard för själva panelen,
/// Istället för att ha den här så komponenten är mer återanvändbar.

