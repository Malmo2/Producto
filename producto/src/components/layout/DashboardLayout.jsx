import styles from "./DashboardLayout.module.css";
import RightPanel from "../panels/Rightpanel";
import ActivityLog from "../Activitylog/Activitylog";

export default function DashboardLayout({ children }) {
  return (
    <>
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
