import { useState, useEffect } from "react";
import "./Calendar.css";
import { apiFetch } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";

function Calendar({ activities, setActivities }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("blue");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await apiFetch("/api/activities");
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      } catch (error) {
        console.error("Could not fetch activities", error);
        setActivities([]);
      }
    };

    fetchActivities();
  }, [setActivities]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Januari",
    "Februari",
    "Mars",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "Augusti",
    "September",
    "Oktober",
    "November",
    "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const activitiesForDay = (day) =>
    activities.filter((a) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return a.activity_date === dateStr;
    });

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

  const deleteEvent = async (activityId) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Not logged in");

      const response = await fetch(`http://localhost:3001/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await apiFetch("/api/activities");
        setActivities(Array.isArray(data.activities) ? data.activities : []);
      } else {
        console.error('Fel vid radering:', response.status);
      }
    } catch (error) {
      console.error('Fel vid radering:', error);
    }
  };

  return (
    <div className="calendar-container">
      <div
        className="calendar-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <button
          onClick={handlePrevMonth}
          style={{
            fontSize: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Föregående"
        >
          ‹
        </button>
        <span style={{ fontWeight: "bold" }}>
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          onClick={handleNextMonth}
          style={{
            fontSize: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Nästa"
        >
          ›
        </button>
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
          {activitiesForDay(selectedDay).map((a) => (
            <li key={a.id}>
              {a.title} 
              <button onClick={() => deleteEvent(a.id)} style={{ marginLeft: '20px', color: 'red' }}>X</button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="calendar-add-form"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!newActivity.trim()) return;
          if (!newDate) return;

          const newEntry = {
            title: newActivity,
            date: newDate,
            time: newTime || "00:00",
            description: newDescription || null,
            color: newColor || null,
          };

          try {
            const data = await apiFetch("/api/activities", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newEntry),
            });

            console.log("Added from API:", data.activity); // debug: check field names

            const added = data.activity;

            const normalized = {
              ...added,
              activity_date: added.activity_date ?? added.date,
              activity_time: added.activity_time ?? added.time,
            };

            setActivities((prev) => [normalized, ...prev]);
            setNewActivity("");
            setNewDate("");
            setNewTime("");
            setNewDescription("");
            setNewColor("blue");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <div className="calendar-date-row">
          <input
            type="text"
            placeholder="Ny aktivitet"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            className="calendar-input"
            required
          />
          <button type="submit" className="calendar-add-btn">
            +
          </button>
        </div>

        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="calendar-input"
          required
        />

        <input
          type="time"
          placeholder="Tid"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="calendar-input"
        />

        <select
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="calendar-input"
        >
          <option value="blue">Blå</option>
          <option value="purple">Lila</option>
          <option value="orange">Orange</option>
          <option value="red">Röd</option>
          <option value="green">Grön</option>
        </select>
      </form>
    </div>
  );
}


export default Calendar;
