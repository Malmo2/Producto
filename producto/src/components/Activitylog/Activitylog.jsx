import './Activitylog.css'

const activities = [
  { id: 1, icon: 'check', title: 'Completed Landing Page Mockup', timestamp: '45 MINUTES AGO' },
  { id: 2, icon: 'target', title: 'Achieved daily 4-hour focus goal', timestamp: '2 HOURS AGO' },
  { id: 3, icon: 'inbox', title: 'Processed 14 Inbox Items', timestamp: 'TODAY, 10:15 AM' },
];

const ActivityItem = ({ icon, title, timestamp }) => {
  return (

<div className='activity-item'>
    <span className={`activity-icon activity-icon--${icon}`}></span>
    <div className='activity-content'>
    <p className='activity-title'>{title}</p>
    <span className='activity-timestamp'>{timestamp}</span>
    
    </div>
</div>

  );
};

function ActivityLog({ items = activities }) {
  return (
    <div className="activity-log">
      <h3 className="activity-log-title">Activity Log</h3>
      <div className="activity-log-items">
        {items.map((item) => (
          <ActivityItem
            key={item.id}
            icon={item.icon}
            title={item.title}
            timestamp={item.timestamp}
          />
        ))}
      </div>
    </div>
  );
}


export default ActivityLog;