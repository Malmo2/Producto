function StatCard({ label, value, delta, tone = "default" }) {
  return (
    <div className="panel">
      <p className="eyebrow">{label}</p>
      <h2 className="metric">{value}</h2>
      <p className={`delta ${tone === "positive" ? "positive" : ""}`}>{delta}</p>
    </div>
  );
}

export default StatCard;
