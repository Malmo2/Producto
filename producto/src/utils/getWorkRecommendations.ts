import { WORK_MODES, type WorkMode } from "../components/recommendations/workModes";

/**
 * Describes the recent direction of the user's energy.
 */
export type EnergyTrend = "up" | "down" | "same" | "no data";

/**
 * Returns up to 3 recommended work modes based on:
 * - current energy
 * - recent energy trend
 * - available time
 *
 * @param {number | null} energy Current energy level. Returns no recommendations if null.
 * @param {EnergyTrend} trend Recent energy trend.
 * @param {number} availableMinutes Number of minutes currently available.
 * @returns {WorkMode[]} The top 3 recommended work modes sorted from best to worst.
 */
export function GetWorkRecommendations(
    energy: number | null,
    trend: EnergyTrend,
    availableMinutes: number,
): WorkMode[] {
    if (energy === null) return [];

    const scored: { mode: WorkMode; score: number }[] = WORK_MODES.map(
        (mode: WorkMode) => {
            let score = 0;

            const energyFits =
                energy >= mode.minEnergy && energy <= mode.maxEnergy;

            const timeFits =
                availableMinutes >= mode.minMinutes &&
                availableMinutes <= mode.maxMinutes;

            if (energyFits) {
                score += 5;
            } else {
                const energyDistance =
                    energy < mode.minEnergy
                        ? mode.minEnergy - energy
                        : energy - mode.maxEnergy;

                score -= energyDistance * 2;
            }

            if (timeFits) {
                score += 5;
            } else {
                const timeDistance =
                    availableMinutes < mode.minMinutes
                        ? mode.minMinutes - availableMinutes
                        : availableMinutes - mode.maxMinutes;

                score -= Math.min(timeDistance / 10, 2);
            }

            if (trend === "down" && mode.id === "deep") score -= 2;
            if (trend === "down" && mode.id === "recover") score += 2;

            if (trend === "up" && (mode.id === "deep" || mode.id === "sprint")) {
                score += 2;
            }

            if (availableMinutes < 25 && mode.id === "micro") score += 2;

            if (
                availableMinutes >= 20 &&
                availableMinutes <= 40 &&
                mode.id === "light"
            ) {
                score += 1;
            }

            if (energy <= 2 && mode.id === "recover") score += 4;
            if (energy <= 2 && mode.id === "light") score -= 2;
            if (energy <= 2 && mode.id === "sprint") score -= 3;
            if (energy <= 2 && mode.id === "deep") score -= 5;

            /**
             * Make deep more reachable for strong energy.
             */
            if (energy >= 5 && mode.id === "deep") score += 6;
            if (energy >= 4 && mode.id === "deep") score += 3;
            if (availableMinutes >= 30 && mode.id === "deep") score += 4;
            if (availableMinutes >= 25 && energy >= 5 && mode.id === "deep") {
                score += 3;
            }

            /**
             * Slightly reduce sprint in long/high-energy cases so deep can win sometimes.
             */
            if (availableMinutes >= 30 && energy >= 4 && mode.id === "sprint") {
                score -= 2;
            }

            return { mode, score };
        },
    );

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 3).map((item) => item.mode);
}