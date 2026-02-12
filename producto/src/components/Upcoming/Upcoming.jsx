import { useMemo } from "react";
import "../Upcoming/Upcoming.css";

const formatTime = (time) => {
  if (!time || time === "TBA") return "TBA";
  return time.split(':').slice(0, 2).join(':');
};

const UpcomingEvent = ({ time, date, title, description, color = "blue" }) => {
  return (
    <div className={`upcoming-event upcoming-event--${color}`}>
      <span className="upcoming-event-date">{date}</span>
      <span className="upcoming-event-time">{formatTime(time)}</span>
      <h4 className="upcoming-event-title">{title}</h4>
      <p className="upcoming-event-description">{description}</p>
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
