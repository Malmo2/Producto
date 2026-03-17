import { useMemo } from 'react';
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
                label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
                value: log.level,
            };
        });
    }, [logs, maxPoints]);

    if (data.length === 0) return null;

    return (
        <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis domain={[1, 5]} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" strokeWidth={2} dot />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}