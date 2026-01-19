import ActivityList from "../activity/ActivityList";

function ActivityLogPanel({ items }) {
  return (
    <section className="panel">
      <div className="section-header">
        <h3 className="section-title">Activity Log</h3>
        <span className="subdued">Recent</span>
      </div>
      <ActivityList items={items} />
    </section>
  );
}

export default ActivityLogPanel;
