import RightPanel from "../panels/Rightpanel";
import CalendarPopup from "../Calendar/Calendar";
import Upcoming from "../Upcoming/Upcoming";
import ActivityLog from "../Activitylog/Activitylog";
import styles from './DashboardLayout.module.css'

export default function DashboardLayout({ children }) {
    return (
        <div className={styles.dashboardLayout}>
            <section className={styles.dashboardMain}>{children}</section>
            <RightPanel>
                <CalendarPopup />
                <Upcoming />
                <ActivityLog />
            </RightPanel>
        </div>
    );
}
