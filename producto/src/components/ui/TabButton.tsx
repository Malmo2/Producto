export function TabButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`ui-toggle-btn ${active ? "ui-toggle-btn-selected" : ""}`}
        >
            {label}
        </button>
    );
}