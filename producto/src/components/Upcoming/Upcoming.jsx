import { useState, useEffect } from "react";
import "../Upcoming/Upcoming.css";

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
        const res = await fetch('http://localhost:3001/activities');
        if (!res.ok) throw new Error('Kunde inte hämta aktiviteter');
        const data = await res.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = data
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Fel vid hämtning av upcoming events:', error);
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
              date={event.date}
              time={event.time || 'TBA'}
              title={event.title}
              description={event.description || ''}
              color={event.color || 'blue'}
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
