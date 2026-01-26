import styles from "./InsightsLayout.module.css";
import Header from "../panels/Header";

export default function InsightsLayout({ children }) {
  return (
    <div className={styles.insightsLayoutContainer}>
      <Header />
      <main className={styles.insightsMain}>{children}</main>
    </div>
  );
}
