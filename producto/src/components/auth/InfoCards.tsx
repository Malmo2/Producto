import { FaBell, FaTasks, FaBullhorn } from "react-icons/fa";

const CARDS = [
  {
    id: "deadline",
    icon: FaBell,
    iconColor: "#f97316",
    title: "Deadline",
    text: "Boiler-room meeting in 1 hour.",
  },
  {
    id: "task-update",
    icon: FaTasks,
    iconColor: "#22c55e",
    title: "Task Update",
    text: "2 completed, 3 pending, 2 in progress.",
  },
  {
    id: "exciting-news",
    icon: FaBullhorn,
    iconColor: "#a855f7",
    title: "Exciting News",
    text: "Producto's new features make work easy and faster!",
  },
];

export default function InfoCards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              padding: 20,
              backgroundColor: "#f8fafc",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              position: "relative",
            }}
          >
            <span style={{ color: card.iconColor, flexShrink: 0, marginTop: 2 }}>
              <Icon size={22} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: card.iconColor, marginBottom: 4 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 14, color: "#0f172a", lineHeight: 1.5 }}>{card.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
