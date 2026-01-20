import '../Upcoming/Upcoming.css'


const upcomingEvents = [
  { id: 1, title: "Benjame's Playground", date: "2024-07-01", time: '13:00', description: 'Playtime', color: 'purple' },
  { id: 2, title: "Johannes Oatcows milked", date: "2024-07-05", time: '19:00', description: 'Milky', color: 'orange' },
];



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




const Upcoming = ({ events = [upcomingEvents] }) => {

  return (
    <div className="upcoming">
      <div className="upcoming-header">
        <h3 className="upcoming-title">Upcoming</h3>
        <a href="#" className="upcoming-link">
          View Calendar
        </a>
      </div>

      <div className="upcoming-events">
        {events.map((event, index) => (
          <UpcomingEvent
            key={index}
            date={event.date}
            time={event.time}
            title={event.title}
            description={event.description}
            color={event.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Upcoming;
