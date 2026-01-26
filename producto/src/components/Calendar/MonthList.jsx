import { useState } from 'react'

function MonthList() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const monthNames = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December"
];

  function PrevMonth() {
    if(currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear -1)
    }
    else setCurrentMonth(currentMonth +1) 

  }

  function NextMonth() {
    if(currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear +1)
    }
    else {
        setCurrentMonth(currentMonth -1)
    }

  }

  return (
	<div>
	  <button onClick={PrevMonth}>  Nästa</button>
      <span>{currentYear} - {monthNames[currentMonth]}</span>      
      <button onClick={NextMonth}> Nästa månad</button>

	</div>
  )
}

export default MonthList