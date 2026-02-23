//Only for practice..

type TotalFocusProp = {
  sessions: { duration: number }[];
  dailyGoal?: number;
};

function TotalFocus({ sessions, dailyGoal = 400 }: TotalFocusProp) {
  if (sessions.length === 0) return null;

  const getTotal = () => {
    const totalSeconds = sessions.reduce((total, session) => {
      return total + session.duration;
    }, 0);
    return Math.floor(totalSeconds / 60);
  };

  const formatTotalTime = () => {
    const totalMinutes = getTotal();
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgress = () => {
    return Math.min((getTotal() / dailyGoal) * 100, 100);
  };

  return (
    <div className="total-focus">
      <h3>TOTAL FOCUSED TODAY</h3>
      <p className="total-time">{formatTotalTime()}</p>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      <p className="goal-text">DAILY GOAL: 8H • {Math.round(getProgress())}%</p>
    </div>
  );
}

export default TotalFocus;
