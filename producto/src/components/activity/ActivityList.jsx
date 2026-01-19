function ActivityList({ items = [] }) {
  return (
    <ul className="activity-list">
      {items.map((item) => (
        <li key={item.id} className="activity-item">
          <span
            className={`badge ${
              item.tone === "success" ? "badge-success" : "badge-info"
            }`}
          />
          {item.label}
          <span className="time">{item.time}</span>
        </li>
      ))}
    </ul>
  );
}

export default ActivityList;
