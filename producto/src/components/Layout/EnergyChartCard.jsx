function EnergyChartCard({ eyebrow, title, chip = "Today", caption }) {
  return (
    <section className="panel energy-chart-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="section-title">{title}</h3>
          {caption ? <p className="subdued">{caption}</p> : null}
        </div>
        <div className="chip">{chip}</div>
      </div>
      <div className="chart-area" aria-label="Energy chart placeholder">
        Chart goes here
      </div>
    </section>
  );
}

export default EnergyChartCard;
