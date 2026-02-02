import './Activitylog.css'
import { useState } from 'react';
import { FaCalendarAlt, FaBell, FaCog } from "react-icons/fa";
import Calendar from '../Calendar/Calendar';
import Upcoming from '../Upcoming/Upcoming';
import Settings from '../Settings/Settings';

const activities = [
  { id: 1, icon: 'check', title: 'Completed Landing Page Mockup', timestamp: '45 MINUTES AGO' },
  { id: 2, icon: 'target', title: 'Achieved daily 4-hour focus goal', timestamp: '2 HOURS AGO' },
  { id: 3, icon: 'inbox', title: 'Processed 14 Inbox Items', timestamp: 'TODAY, 10:15 AM' },
  { id: 4, icon: 'check', title: 'Finished UI Design Review', timestamp: 'YESTERDAY, 3:00 PM' },
  { id: 5, icon: 'target', title: 'Completed Project Milestone', timestamp: '2 DAYS AGO' },
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
  const [view, setView] = useState("default");

  console.log("Current view:", view);

  const handleBellClick = () => {
    console.log("Bell clicked");
    setView("activitylog");
  };

  const handleCalendarClick = () => {
    console.log("Calendar clicked");
    setView("default");
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
    setView("settings")


  }

  return (
    <>
      <div className="calendar-icon-row">
        <button type="button" className="icon-btn" aria-label="Calendar" onClick={handleCalendarClick}>
          <FaCalendarAlt />
        </button>
        <button type="button" className="icon-btn" aria-label="Notifications" onClick={handleBellClick}>
          <FaBell />
        </button>
        <button type="button" className="icon-btn" aria-label="Settings" onClick={handleSettingsClick}>
          <FaCog />
        </button>
      </div>
      {view === "activitylog" ? (
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
      ) : view === "settings" ? (
        <Settings onClose={() => setView("default")} />
      ) : (
        <>
          <Calendar />
          <Upcoming />
        </>
      )}
    </>
  );
}


export default ActivityLog;