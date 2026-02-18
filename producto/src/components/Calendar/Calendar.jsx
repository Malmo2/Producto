import { useState, useEffect } from "react";
import "./Calendar.css";
import { apiFetch } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";
import { useEnergy } from "../energy/context/EnergyContext";

function Calendar({ activities, setActivities }) {
  const { logs } = useEnergy();
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newEnergyLevel, setNewEnergyLevel] = useState(null);

  useEffect(() => {
    if (logs.length > 0) {
      const latestLog = logs[0];
      setNewEnergyLevel(latestLog.level);
    }
  }, [logs]);

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

  const energyColorMap = {
    1: "#ef4444",
    2: "#f97316",
    3: "#eab308",
    4: "#84cc16", 
    5: "#22c55e",
  };

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
          const dayActivities = activitiesForDay(day);
          const hasActivities = dayActivities.length > 0;
          const maxEnergyLevel = hasActivities 
            ? Math.max(...dayActivities.map(a => a.energy_level || 3))
            : null;
          const maxEnergyColor = maxEnergyLevel ? energyColorMap[maxEnergyLevel] : null;

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`calendar-day ${hasActivities ? "calendar-day--has-activity" : ""}`}
              style={hasActivities && maxEnergyColor ? {
                borderTop: `3px solid ${maxEnergyColor}`,
              } : {}}
            >
              {day}
              {hasActivities && <span className="calendar-dot" style={{ backgroundColor: maxEnergyColor }} />}
            </div>
          );
        })}
      </div> 

      <ul className="calendar-activities">
        {selectedDay ? (
          activitiesForDay(selectedDay).length > 0 ? (
            activitiesForDay(selectedDay).map((a) => {
              const energyLevel = a.energy_level || 3;
              const bgColor = energyColorMap[energyLevel];
              return (
                <li key={a.id} style={{
                  borderLeft: `4px solid ${bgColor}`,
                  paddingLeft: '12px',
                }}>
                  <span style={{ fontWeight: 500 }}>{a.title}</span>
                  <span style={{ marginLeft: '10px', fontSize: '0.85em', opacity: 0.7 }}>
                    (Energy: {energyLevel})
                  </span>
                  <button 
                    onClick={() => deleteEvent(a.id)} 
                    style={{ marginLeft: '20px', color: bgColor, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </li>
              );
            })
          ) : (
            <li style={{ opacity: 0.5, fontStyle: 'italic' }}>No activities this day</li>
          )
        ) : (
          <li style={{ opacity: 0.5, fontStyle: 'italic' }}>Select a day to see activities</li>
        )}
      </ul>
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
            energy_level: newEnergyLevel,
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
              energy_level: added.energy_level ?? newEnergyLevel,
            };

            setActivities((prev) => [normalized, ...prev]);
            setNewActivity("");
            setNewDate("");
            setNewTime("");
            setNewDescription("");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <div className="calendar-date-row">
          <input
            type="text"
            placeholder="New activity"
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
          placeholder="Time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="calendar-input"
        />

        <div style={{ 
          padding: '10px 12px', 
          backgroundColor: 'var(--card)', 
          borderRadius: '8px',
          border: '1px solid var(--border, #ddd)',
          fontSize: '0.95rem',
          color: 'var(--text)'
        }}>
          Energy Level: {newEnergyLevel || '-'} {newEnergyLevel ? ['🔴', '🟠', '🟡', '🟢', '🟢'][newEnergyLevel - 1] : '⚪'}
        </div>
      </form>
    </div>
  );
}


export default Calendar;
