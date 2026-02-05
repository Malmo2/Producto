import { useState, useEffect } from "react";
import "./Calendar.css";

function Calendar() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activities, setActivities] = useState([])

  // useEffect(() => {
  //   const fetchActivities = async () => {
  //     try {
  //       const res = await fetch('http://localhost:3001/activities');
  //       if (!res.ok) throw new Error('Något gick fel vid hämtning');
  //       const data = await res.json();
  //       setActivities(Array.isArray(data) ? data : []);
  //     } catch (error) {
  //       console.error('Kunde inte hämta aktiviteter', error);
  //       setActivities([]);
  //     }
  //   };
  //   fetchActivities();
  // }, [])


  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Januari", "Februari", "Mars", "April", "Maj", "Juni",
    "Juli", "Augusti", "September", "Oktober", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const activitiesForDay = (day) =>
    activities.filter(
      (a) =>
        a.date ===
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={handlePrevMonth} style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Föregående">‹</button>
        <span style={{ fontWeight: 'bold' }}>{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={handleNextMonth} style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Nästa">›</button>
      </div>

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
  );
}


export default Calendar
