import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./Calendar.css";

const activities = [
  { date: "2026-01-05", title: "Möte" },
  { date: "2026-01-12", title: "Gym" },
  { date: "2026-01-12", title: "Lunch" },
];


function CalendarPopup() {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

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
    <div style={{ position: "relative", marginLeft: '300px' }}>
      <FaCalendarAlt onClick={() => setOpen(!open)} style={{ cursor: "pointer" }} />

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
