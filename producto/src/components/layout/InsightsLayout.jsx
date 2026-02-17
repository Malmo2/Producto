import styles from "./InsightsLayout.module.css";
import Header from "../panels/Header";

export default function InsightsLayout({ children }) {
  return (
    <div className={styles.insightsLayoutContainer}>
      <Header />

      <main className={styles.insightsMain}>
        <section className={styles.topRow}>
          <div className={styles.topRowContent}>
            <div className={styles.titleBlock}>
              <h1 className={styles.pageTitle}>Your Weekly Insights</h1>
              <p className={styles.subtitle}>
                Track focus, energy, and sessions across the past weeks.
              </p>
            </div>

            <div className={styles.filters}>
              <select className={styles.select} defaultValue="energy">
                <option value="energy">Energy</option>
                <option value="focus">Focus</option>
                <option value="sessions">Sessions</option>
              </select>

              <select className={styles.select} defaultValue="all">
                <option value="all">All activity</option>
                <option value="work">Work</option>
                <option value="meeting">Meeting</option>
                <option value="break">Break</option>
              </select>

              <select className={styles.select} defaultValue="feb-04-25">
                <option value="feb-04-25">Feb 4-10</option>
                <option value="feb-11-17">Feb 11-17</option>
                <option value="feb-18-24">Feb 18-24</option>
              </select>
            </div>
          </div>

          <aside className={styles.tipCard}>
            <div className={styles.tipHeader}>
              <span className={styles.tipIcon} aria-hidden="true">
                💡
              </span>
              <span className={styles.tipLabel}>Tip of the Day</span>
            </div>
            <p className={styles.tipText}>
              Block time for deep work when your energy is highest. Use breaks to
              reset before context switches.
            </p>
          </aside>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Trends Over Time</h2>
            <p className={styles.chatPlaceholder}>Chat with your data...</p>
          </article>

          {children ? (
            <article className={`${styles.card} ${styles.cardWide}`}>
              {children}
            </article>
          ) : null}
        </section>
      </main>
    </div>
  );
}
