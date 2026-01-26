import styles from "./DashboardLayout.module.css";
import RightPanel from "../panels/Rightpanel";
import CalendarPopup from "../Calendar/Calendar";
import Upcoming from "../Upcoming/Upcoming";
import ActivityLog from "../Activitylog/Activitylog";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <section className={styles.dashboardMain}>{children}</section>

      <div className={styles.rightColumn}>
        <RightPanel>
          <CalendarPopup />
          <Upcoming />
          <ActivityLog />
        </RightPanel>
      </div>
    </div>
  );
}
