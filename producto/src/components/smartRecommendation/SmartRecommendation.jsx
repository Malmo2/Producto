import Button from "../button/button";
import  styles  from "./smartRecommendation.module.css";

function SmartRecommendation() {
  return (
    <div className={styles.smartContainer}>
      <div className={styles.titleRow}>
        <img  alt="icon" className={styles.titleIcon} />
        <h4>Smart Recommendation</h4>
      </div>
      <h2>Peak Energy: High Intensity Phase</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque tenetur
        cumque dignissimos optio magni ut et ullam sunt ratione labore
        repellendus qui, molestiae temporibus sequi quas consequatur. Quibusdam,
        aspernatur rem!
      </p>

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
