import Button from "../button/button";
import { useEnergy } from "../energy/context/EnergyContext";
import  styles  from "./smartRecommendation.module.css";
import { useTheme } from '../Darkmode/ThemeContext'

function SmartRecommendation() {
const { theme }= useTheme()

  const { logs } = useEnergy();

  const latest = logs[0]?.level;
  const previous = logs[1]?.level;

  let trend = "no data";
  if (latest != null && previous != null) {
    if (latest > previous) trend = "up";
    else if (latest < previous) trend = "down";
    else trend = "same";
  }

  let title = "Smart Recommendation";
  let heading = "Log your energy to get recommendations";
  let text = "Go to Energy page and save at least 1–2 energy logs.";

  if (latest != null) {
    if (latest <= 2) {
      heading = "Low Energy: Take a Break";
      text = "Your energy is low. Take a short break, drink water, or stretch.";
    } else if (latest === 3) {
      heading = "Medium Energy: Light Work";
      text = "Good time for admin tasks, planning, or easy coding.";
    } else {
      heading = "High Energy: Deep Work";
      text = "Perfect moment for focused work. Start a deep work session.";
    }

    if (trend === "down") {
      text += " (Energy is dropping — plan a break soon.)";
    } else if (trend === "up") {
      text += " (Energy is rising — push a focused block now.)";
    }
  }

  return (
    <div className={styles.smartContainer} data-theme={theme}>
      <div className={styles.titleRow}>
        <img  alt="icon" className={styles.titleIcon} />
        <h4>{title}</h4>

      </div>
      <h2>{heading}</h2>
      <p>{text}</p>

      <div className={styles.middleIcon}>
        <img alt="middle icon" />
      </div>

      <div className={styles.buttons}>
        <Button variant={{}}>Start Focus Session</Button>
        <Button>Snooze</Button>
        
      </div>
    </div>
  );
}

export default SmartRecommendation;
