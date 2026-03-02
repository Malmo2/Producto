import React from "react";
import { Card } from "../ui";

type BaseStatCardProps = React.ComponentProps<typeof Card> & {
    highlighted?: boolean;
};

function BaseStatCard({ highlighted = false, style, ...props }: BaseStatCardProps) {
    return (
        <Card
            {...props}
            style={{
                borderRadius: highlighted ? "18px" : "12px",
                padding: "20px",
                height: "100%",
                minHeight: 120,
                backgroundColor: highlighted ? "#1E6FE3" : "#121A2B",
                boxShadow: highlighted ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                border: "none",
                ...style,
            }}
        />
    );
}

export default BaseStatCard;