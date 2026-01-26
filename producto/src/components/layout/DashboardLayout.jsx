import styles from "./DashboardLayout.module.css";
import RightPanel from "../panels/Rightpanel";
import Upcoming from "../Upcoming/Upcoming";
import ActivityLog from "../Activitylog/Activitylog";
import Header from "../panels/Header";
import Calendar from "../Calendar/Calendar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Header />
      <div className={styles.dashboardLayout}>
        <section className={styles.dashboardMain}>{children}</section>
        <div className={styles.rightColumn}>
          <RightPanel>
            <Calendar />
            <Upcoming />
            <ActivityLog />
          </RightPanel>
        </div>
      </div>
    </>
  );
}
