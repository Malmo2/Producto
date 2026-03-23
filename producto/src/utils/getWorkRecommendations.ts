import { WORK_MODES, type WorkMode } from "../components/recommendations/workModes";

/**
 * Describes whether the user's energy is rising, falling, unchanged,
 * or unavailable.
 */
export type EnergyTrend = "up" | "down" | "same" | "no data";

/**
 * Returns the top 3 recommended work modes based on:
 * - current energy level
 * - recent energy trend
 * - available time
 *
 * Scoring rules:
 * - mode gets a strong bonus if energy fits its target range
 * - mode gets a bonus if available time fits its target range
 * - deep work is penalized when energy is trending down
 * - deep/sprint get a bonus when energy is trending up
 * - micro gets a bonus for very short time windows
 *
 * If `energy` is null, no recommendations are returned.
 *
 * @param energy Current energy score, or null if unavailable
 * @param trend Direction of recent energy change
 * @param availableMinutes Number of minutes currently available
 * @returns Up to 3 recommended work modes, sorted by best match first
 */
export function GetWorkRecommendations(
    energy: number | null,
    trend: EnergyTrend,
    availableMinutes: number
): WorkMode[] {
    if (energy === null) return [];

    const scored = WORK_MODES.map((mode) => {
        let score = 0;

        /**
         * Reward modes whose energy range matches the user's current energy.
         */
        const energyFits = energy >= mode.minEnergy && energy <= mode.maxEnergy;
        score += energyFits ? 5 : -5;

        /**
         * Reward modes whose time range matches the user's available time.
         */
        const timeFits =
            availableMinutes >= mode.minMinutes && availableMinutes <= mode.maxMinutes;
        score += timeFits ? 5 : -3;

        /**
         * Avoid deep work when energy is dropping.
         */
        if (trend === "down" && mode.id === "deep") score -= 4;

        /**
         * Favor more demanding modes when energy is rising.
         */
        if (trend === "up" && (mode.id === "deep" || mode.id === "sprint")) {
            score += 2;
        }

        /**
         * Favor micro tasks when very little time is available.
         */
        if (availableMinutes < 25 && mode.id === "micro") score += 2;

        return { mode, score };
    });

    /**
     * Sort modes from highest score to lowest score.
     */
    scored.sort((a, b) => b.score - a.score);

    /**
     * Return only the top 3 recommendations.
     */
    return scored.slice(0, 3).map((x) => x.mode);
}