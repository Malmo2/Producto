import React from "react";
import { Box, Typography } from "../ui";
import { IoChevronForward } from "react-icons/io5";
import BaseStatCard from "./BaseStatCard";

type QuickActionCardProps = {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    onClick: () => void;
};

function QuickActionCard({ icon: Icon, title, subtitle, onClick }: QuickActionCardProps) {
    return (
        <button
            type="button"
            className="quick-action-card ui-card"
            onClick={onClick}
            style={{
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
            }}
        >
            <BaseStatCard
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transition: "background-color 0.2s, color 0.2s, box-shadow 0.2s",
                }}
            >
                <Box style={{ fontSize: 28, color: "#A0A0A0", flexShrink: 0 }}>
                    <Icon size={28} />
                </Box>

                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" style={{ color: "#FFFFFF", marginBottom: 4 }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="muted">
                        {subtitle}
                    </Typography>
                </Box>

                <Box style={{ color: "#A0A0A0", flexShrink: 0 }}>
                    <IoChevronForward size={20} />
                </Box>
            </BaseStatCard>
        </button>
    );
}

export default QuickActionCard;