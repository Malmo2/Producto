import styles from './InsightsLayout.module.css'

export default function InsightsLayout({ children }) {
    return (
        <div className={styles.insightsLayoutContainer}>
            <section className={styles.insightsMain}>{children}</section>
        </div>
    );
}
