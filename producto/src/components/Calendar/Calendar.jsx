import { useState, useEffect } from "react";
import { FaCalendarAlt, FaBell, FaQuestionCircle } from "react-icons/fa";
import "./Calendar.css";

function CalendarPopup() {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('http://localhost:3001/activities');
        if (!res.ok) throw new Error('Något gick fel vid hämtning');
        const data = await res.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Kunde inte hämta aktiviteter', error);
        setActivities([]);
      }
    };
    fetchActivities();
  }, [])

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const activitiesForDay = (day) =>
    activities.filter(
      (a) =>
        a.date ===
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );

  return (
    <div className="calendar-icon-row">
      <FaQuestionCircle />
      <FaBell />
      <FaCalendarAlt onClick={() => setOpen(!open)} />

      {open && (
        <div className="calendar-popup">
          <h4>
            {today.toLocaleString("sv-SE", {
              month: "long",
              year: "numeric",
            })}
          </h4>

          <div className="calendar-grid">
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const hasActivities = activitiesForDay(day).length > 0;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`calendar-day ${hasActivities ? "calendar-day--has-activity" : ""}`}
                >
                  {day}
                  {hasActivities && <span className="calendar-dot" />}
                </div>
              );
            })}
          </div>

          {selectedDay && (
            <ul className="calendar-activities">
              {activitiesForDay(selectedDay).map((a, i) => (
                <li key={i}>{a.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


export default CalendarPopup
