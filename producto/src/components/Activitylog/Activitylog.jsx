import "./Activitylog.css";
import { useState } from "react";
import { FaCalendarAlt, FaBell } from "react-icons/fa";
import Calendar from "../Calendar/Calendar";
import Upcoming from "../Upcoming/Upcoming";
import { IconButton, Typography } from "../ui";

const activities = [
  {
    id: 1,
    icon: "check",
    title: "Completed Landing Page Mockup",
    timestamp: "45 MINUTES AGO",
  },
  {
    id: 2,
    icon: "target",
    title: "Achieved daily 4-hour focus goal",
    timestamp: "2 HOURS AGO",
  },
  {
    id: 3,
    icon: "inbox",
    title: "Processed 14 Inbox Items",
    timestamp: "TODAY, 10:15 AM",
  },
  {
    id: 4,
    icon: "check",
    title: "Finished UI Design Review",
    timestamp: "YESTERDAY, 3:00 PM",
  },
  {
    id: 5,
    icon: "target",
    title: "Completed Project Milestone",
    timestamp: "2 DAYS AGO",
  },
];

const ActivityItem = ({ icon, title, timestamp }) => {
  return (
    <div className="activity-item">
      <span className={`activity-icon activity-icon--${icon}`}></span>
      <div className="activity-content">
        <Typography variant="body1" className="activity-title">{title}</Typography>
        <Typography variant="caption" color="muted" className="activity-timestamp">{timestamp}</Typography>
      </div>
    </div>
  );
};

function ActivityLog({ items = activities }) {
  const [view, setView] = useState("default");
  const [activities, setActivities] = useState([]);

  console.log("Current view:", view);

  const handleBellClick = () => {
    console.log("Bell clicked");
    setView("activitylog");
  };

  const handleCalendarClick = () => {
    console.log("Calendar clicked");
    setView("default");
  };

  return (
    <>
      <div className="calendar-icon-row">
        <IconButton aria-label="Calendar" onClick={handleCalendarClick}>
          <FaCalendarAlt />
        </IconButton>
        <IconButton aria-label="Notifications" onClick={handleBellClick}>
          <FaBell />
        </IconButton>
      </div>
      {view === "activitylog" ? (
        <div className="activity-log">
          <Typography variant="h6" component="h3" className="activity-log-title">Activity Log</Typography>
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
      ) : (
        <>
          <Calendar activities={activities} setActivities={setActivities} />
          <Upcoming activities={activities} />
        </>
      )}
    </>
  );
}

export default ActivityLog;
