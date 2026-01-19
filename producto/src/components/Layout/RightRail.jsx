import QuickActions from "../quick-actions/QuickActions";
import UpcomingPanel from "../Upcoming/Upcoming";
import ActivityLogPanel from "../panels/ActivityLogPanel";

function RightRail({ events, activityItems }) {
  return (
    <aside className="right-rail" aria-label="Secondary">
      <QuickActions />
      <UpcomingPanel events={events} />
      <ActivityLogPanel items={activityItems} />
    </aside>
  );
}

export default RightRail;
