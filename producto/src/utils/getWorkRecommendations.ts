import {
  WORK_MODES,
  type WorkMode,
} from "../components/recommendations/workModes";

export type EnergyTrend = "up" | "down" | "same" | "no data";

export type RecommendationResult = {
  mode: WorkMode;
  score: number;
  reasons: string[];
};

function normalizeMinutes(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 30;
}

export function getScoredWorkRecommendations(
  energy: number | null,
  trend: EnergyTrend,
  availableMinutes: number,
): RecommendationResult[] {
  if (energy === null) return [];

  const minutes = normalizeMinutes(availableMinutes);

  const scored = WORK_MODES.map((mode) => {
    let score = 0;
    const reasons: string[] = [];

    const energyFits = energy >= mode.minEnergy && energy <= mode.maxEnergy;
    if (energyFits) {
      score += 6;
      reasons.push(`Energy ${energy}/5 matches this mode well.`);
    } else {
      score -= 6;
    }

    const timeFits = minutes >= mode.minMinutes && minutes <= mode.maxMinutes;
    if (timeFits) {
      score += 5;
      reasons.push(`${minutes} minutes fits this work block.`);
    } else if (minutes < mode.minMinutes) {
      score -= 3;
      reasons.push(`You have less time than this mode usually needs.`);
    } else {
      score -= 1;
      reasons.push(`You have more time than this mode usually needs.`);
    }

    if (trend === "down" && mode.id === "deep") {
      score -= 5;
      reasons.push(
        `Your energy is dropping, so deep work is less ideal right now.`,
      );
    }

    if (trend === "down" && mode.id === "sprint") {
      score -= 3;
      reasons.push(
        `A shorter task may be safer because your energy is trending down.`,
      );
    }

    if (trend === "up" && (mode.id === "deep" || mode.id === "sprint")) {
      score += 3;
      reasons.push(`Your energy is rising, which supports more focused work.`);
    }

    if (energy <= 2 && mode.id === "recover") {
      score += 5;
      reasons.push(`Low energy makes recovery a strong choice.`);
    }

    if (minutes < 25 && mode.id === "micro") {
      score += 4;
      reasons.push(`A short time window favors quick wins.`);
    }

    if (minutes >= 45 && mode.id === "deep") {
      score += 3;
      reasons.push(`You have enough time for a longer focus block.`);
    }

    if (energy >= 4 && mode.id === "deep") {
      score += 2;
      reasons.push(`High energy supports harder cognitive work.`);
    }

    if (reasons.length === 0) {
      reasons.push(
        `Balanced fit based on your current energy and available time.`,
      );
    }

    return { mode, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3);
}

export function GetWorkRecommendations(
  energy: number | null,
  trend: EnergyTrend,
  availableMinutes: number,
): WorkMode[] {
  return getScoredWorkRecommendations(energy, trend, availableMinutes).map(
    (item) => item.mode,
  );
}
