import CalendarPopup from "../Calendar/Calendar";
import Upcoming from "../Upcoming/Upcoming";
import ActivityLog from "../Activitylog/Activitylog";
import styles from './rightpanel.module.css'

export default function RightPanel() {
    return (
        <div className={styles.rightPanel}>
            <CalendarPopup />
            <Upcoming />
            <ActivityLog />
        </div>
    );
}