import { WORK_MODES, type WorkMode } from "../components/recommendations/workModes";

export type EnergyTrend = "up" | "down" | "same" | "no data";

export function GetWorkRecommendations(
    energy: number | null,
    trend: EnergyTrend,
    availableMinutes: number
): WorkMode[] {
    if (energy === null) return [];

    const scored = WORK_MODES.map((mode) => {
        let score = 0;

        const energyFits = energy >= mode.minEnergy && energy <= mode.maxEnergy;
        score += energyFits ? 5 : -5;

        const timeFits = availableMinutes >= mode.minMinutes && availableMinutes <= mode.maxMinutes;
        score += timeFits ? 5 : -3;

        if (trend === "down" && mode.id === "deep") score -= 4;

        if (trend === "up" && (mode.id === "deep" || mode.id === "sprint")) score += 2;

        if (availableMinutes < 25 && mode.id === "micro") score += 2;

        return { mode, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((x) => x.mode);
}