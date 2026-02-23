import type { EnergyTrend } from "./getWorkRecommendations";

type EnergyLog = {
    level: number;
    createdAt: string;
};

export function getEnergyTrend(logs: EnergyLog[], points: number = 6): EnergyTrend {
    if (logs.length < 2) return "no data";

    const slice = logs.slice(0, points);

    const newestEntry = slice.at(0);
    const oldestEntry = slice.at(-1);

    if (!newestEntry || !oldestEntry) return "no data";

    const newest = newestEntry.level;
    const oldest = oldestEntry.level;
    if (newest > oldest) return "up";
    if (newest < oldest) return "down";
    return "same";
}