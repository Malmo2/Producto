function ChartPlaceholder({ title, eyebrow, caption, chip = "Today" }) {
  return (
    <section className="panel chart-placeholder">
      <div className="section-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="section-title">{title}</h3>
          {caption ? <p className="subdued">{caption}</p> : null}
        </div>
        <div className="chip">{chip}</div>
      </div>
      <div className="chart-area">Chart goes here</div>
    </section>
  );
}

export default ChartPlaceholder;
