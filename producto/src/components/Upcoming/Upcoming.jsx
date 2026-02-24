import { useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "../Upcoming/Upcoming.css";

const COLOR_MAP = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  orange: "#f97316",
  red: "#ef4444",
};

const formatTime = (time) => {
  if (!time || time === "TBA") return "TBA";
  return time.split(':').slice(0, 2).join(':');
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const UpcomingEvent = ({ time, date, title, description, color = "blue" }) => {
  const iconColor = COLOR_MAP[color] || COLOR_MAP.blue;
  const dateTime = `${formatDate(date)} • ${formatTime(time)}`;
  const text = description ? `${dateTime} — ${description}` : dateTime;

  return (
    <div className={`upcoming-event upcoming-event--${color}`}>
      <span className="upcoming-event-icon" style={{ color: iconColor }}>
        <FaCalendarAlt size={22} />
      </span>
      <div className="upcoming-event-content">
        <div className="upcoming-event-title">{title}</div>
        <div className="upcoming-event-text">{text}</div>
      </div>
    </div>
  );
};

const Upcoming = ({ activities }) => {
  const upcomingEvents = useMemo(() => {
    const list = Array.isArray(activities) ? activities : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return list
      .filter((event) => {
        const eventDate = new Date(event.activity_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.activity_date).getTime() -
          new Date(b.activity_date).getTime(),
      )
      .slice(0, 3);
  }, [activities]);

  return (
    <div className="upcoming">
      <div className="upcoming-header">
        <h3 className="upcoming-title">Upcoming</h3>
        <a href="#" className="upcoming-link"></a>
      </div>

      <div className="upcoming-events">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <UpcomingEvent
              key={event.id}
              date={event.activity_date}
              time={event.activity_time || "TBA"}
              title={event.title}
              description={event.description || ""}
              color={event.color || "blue"}
            />
          ))
        ) : (
          <p>Inga kommande händelser</p>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
