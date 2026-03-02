import { Typography } from "../ui";
import BaseStatCard from "./BaseStatCard";

type StatCardProps = {
  label: string;
  value: string;
  highlighted?: boolean;
};

function StatCard({ label, value, highlighted = false }: StatCardProps) {
  return (
    <BaseStatCard
      highlighted={highlighted}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <Typography
        variant="body2"
        style={{
          color: highlighted ? "#000" : "#A0A0A0",
          marginBottom: 8,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h2"
        style={{
          color: highlighted ? "#000" : "#FFFFFF",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </BaseStatCard>
  );
}

export default StatCard;