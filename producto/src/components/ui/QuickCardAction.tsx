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
            className="quick-action-card"
            onClick={onClick}
        >
            <BaseStatCard
                className="quick-action-card-inner"
            >
                <Box className="quick-action-icon">
                    <Icon size={28} />
                </Box>

                <Box className="quick-action-content">
                    <Typography variant="subtitle1" className="quick-action-title">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="muted" className="quick-action-subtitle">
                        {subtitle}
                    </Typography>
                </Box>

                <Box className="quick-action-chevron">
                    <IoChevronForward size={20} />
                </Box>
            </BaseStatCard>
        </button>
    );
}

export default QuickActionCard;