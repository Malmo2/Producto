import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "../energy/context/EnergyContext";
import { useTheme } from "../Darkmode/ThemeContext";
import styles from "./smartRecommendation.module.css";
import { EnergyChart } from "../energy/EnergyChart";
import { getEnergyTrend } from "../../utils/getEnergyTrend";
import { GetWorkRecommendations } from "../../utils/getWorkRecommendations";
import { useRecommendationPlan } from "../../contexts/RecommendationPlanContext";
import { Card, Typography, Box, Button } from "../ui";
import { useTimer } from "../../contexts/TimerContext";

function SmartRecommendation() {
  const { theme } = useTheme();
  const { logs } = useEnergy();
  const navigate = useNavigate();
  const { setPlan } = useRecommendationPlan();
  const { state } = useTimer();

  const availableMinutes = useMemo(() => {
    const n = Number(state.customMinutes);
    return Number.isFinite(n) && n > 0 ? n : 30;
  }, [state.customMinutes]);

  const latestEnergy = logs[0]?.level ?? null;

  const trend = useMemo(() => {
    return getEnergyTrend(logs, 6);
  }, [logs]);

  const best = useMemo(() => {
    const recommendations = GetWorkRecommendations(
      latestEnergy,
      trend,
      availableMinutes,
    );
    return recommendations[0] ?? null;
  }, [latestEnergy, trend, availableMinutes]);

  const title = "Smart Recommendations";

  const heading = best ? best.title : "Log your energy to get recommendations";
  const text = best
    ? `${best.description} (Trend: ${trend})`
    : "Go to Energy page and save at least 1–2 energy logs.";

  const handleStartRecommended = () => {
    if (!best) return;

    setPlan({
      timerMode: best.timerMode,
      minutes: best.minutes,
      label: best.title,
    });

    navigate("/timer");
  };

  return (
    <Card
      className={styles.smartContainer}
      data-theme={theme}
      style={{ padding: 20 }}
    >
      <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className={styles.titleRow}>
          <Typography variant="h6" component="h4">
            {title}
          </Typography>
        </div>

        <Typography variant="h5" component="h2">
          {heading}
        </Typography>

        <Typography variant="body1" color="muted">
          {text}
        </Typography>

        {best ? (
          <Box style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleStartRecommended}>
              Start recommended session
            </Button>
          </Box>
        ) : null}

        {logs.length > 0 ? <EnergyChart logs={logs} maxPoints={14} /> : null}
      </Box>
    </Card>
  );
}

export default SmartRecommendation;