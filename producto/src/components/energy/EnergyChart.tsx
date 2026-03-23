import { useMemo } from "react";
import { Box, Typography } from "../ui";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type EnergyLog = {
  level: number;
  createdAt: string;
};

type Props = {
  logs: EnergyLog[];
  maxPoints?: number;
};

export function EnergyChart({ logs, maxPoints = 14 }: Props) {
  const data = useMemo(() => {
    const sliced = logs.slice(0, maxPoints).reverse();

    return sliced.map((log) => {
      const d = new Date(log.createdAt);

      return {
        label: d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        value: log.level,
      };
    });
  }, [logs, maxPoints]);

  return (
    <Box>
      <Typography variant="h6" component="h3" gutterBottom>
        Energy chart
      </Typography>

      {data.length === 0 ? (
        <Box
          style={{
            padding: 16,
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--card)",
            color: "var(--muted)",
          }}
        >
          No energy logs yet.
        </Box>
      ) : (
        <Box
          style={{
            width: "100%",
            height: 220,
            padding: 12,
            border: "1px solid var(--border)",
            borderRadius: 8,
            background: "var(--card)",
          }}
        >
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                domain={[1, 5]}
                allowDecimals={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={{ stroke: "var(--border)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="orange"
                strokeWidth={3}
                dot={{ r: 4, fill: "orange" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}