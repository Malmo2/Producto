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
            style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                backgroundColor: active ? "#1E6FE3" : "#121A2B",
                color: active ? "#000" : "#FFFFFF",
                fontWeight: 700,
            }}
        >
            {label}
        </button>
    );
}