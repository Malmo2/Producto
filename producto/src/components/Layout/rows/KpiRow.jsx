import StatCard from "../../cards/StatCard";
function KpiRow({ items = [] }) {
  return (
    <section className="kpi-row">
      {items.map((card) => (
        <StatCard
          key={card.id}
          label={card.label}
          value={card.value}
          delta={card.delta}
          tone={card.tone}
        />
      ))}
    </section>
  );
}

export default KpiRow;
