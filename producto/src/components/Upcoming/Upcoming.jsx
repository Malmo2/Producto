import { useState, useEffect } from "react";
import "../Upcoming/Upcoming.css";
import { apiFetch } from "../../lib/api";

const UpcomingEvent = ({ time, date, title, description, color = "blue" }) => {
  return (
    <div className={`upcoming-event upcoming-event--${color}`}>
      <span className="upcoming-event-date">{date}</span>
      <span className="upcoming-event-time">{time}</span>
      <h4 className="upcoming-event-title">{title}</h4>
      <p className="upcoming-event-description">{description}</p>
    </div>
  );
};

const Upcoming = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const data = await apiFetch("/api/activities");
        const activities = Array.isArray(data.activities)
          ? data.activities
          : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = activities
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

        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error("Fel vid hämtning av upcoming events:", error);
        setUpcomingEvents([]);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="upcoming">
      <div className="upcoming-header">
        <h3 className="upcoming-title">Upcoming</h3>
        <a href="#" className="upcoming-link"></a>
      </div>

      <div className="upcoming-events">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <UpcomingEvent
              key={event.id || index}
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
