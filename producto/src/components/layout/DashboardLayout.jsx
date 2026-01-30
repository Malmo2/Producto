import styles from "./DashboardLayout.module.css";
import RightPanel from "../panels/Rightpanel";
import ActivityLog from "../Activitylog/Activitylog";
import Header from "../panels/Header";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div className={styles.dashboardLayout}>
        <section className={styles.dashboardMain}>{children}</section>
        <div className={styles.rightColumn}>
          <RightPanel>
            <ActivityLog />
          </RightPanel>
        </div>
      </div>
    </>
  );
}
 