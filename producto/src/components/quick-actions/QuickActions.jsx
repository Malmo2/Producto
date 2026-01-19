const actions = [
  { id: "calendar", label: "Open calendar", icon: "📅" },
  { id: "notifications", label: "Notifications", icon: "🔔", badge: true },
  { id: "help", label: "Help & support", icon: "❓" },
];

function QuickActions() {
  return (
    <div className="quick-actions" aria-label="Quick actions">
      {actions.map((action) => (
        <button
          key={action.id}
          className="icon-btn"
          type="button"
          aria-label={action.label}
        >
          <span className="icon-btn__icon">{action.icon}</span>
          {action.badge ? <span className="icon-btn__badge" aria-hidden /> : null}
        </button>
      ))}
    </div>
  );
}

export default QuickActions;
