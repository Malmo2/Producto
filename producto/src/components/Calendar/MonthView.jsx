import { useState } from 'react'

function MonthView() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(null)

  const monthNames = [
    'Januari','Februari','Mars','April','Maj','Juni',
    'Juli','Augusti','September','Oktober','November','December'
  ]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  function PrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDay(null)
  }

  function NextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDay(null)
  }

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button onClick={PrevMonth} aria-label="Föregående månad">‹</button>
        <div style={{ fontWeight: 'bold' }}>{monthNames[currentMonth]} {currentYear}</div>
        <button onClick={NextMonth} aria-label="Nästa månad">›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 32px)', gap: 4, justifyContent: 'start' }}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                background: selectedDay === day ? '#efefef' : 'transparent'
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {selectedDay && (
        <div style={{ marginTop: 8 }}>
          Vald dag: {selectedDay} {monthNames[currentMonth]} {currentYear}
        </div>
      )}
    </div>
  )
}

export default MonthView
