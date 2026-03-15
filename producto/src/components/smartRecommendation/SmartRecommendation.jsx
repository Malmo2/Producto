import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEnergy } from "../energy/context/EnergyContext";
import { useTheme } from "../Darkmode/ThemeContext";
import styles from "./smartRecommendation.module.css";
import { EnergyChart } from "../energy/EnergyChart";
import { getEnergyTrend } from "../../utils/getEnergyTrend";
import { getScoredWorkRecommendations } from "../../utils/getWorkRecommendations";
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

  const recommendations = useMemo(() => {
    return getScoredWorkRecommendations(latestEnergy, trend, availableMinutes);
  }, [latestEnergy, trend, availableMinutes]);

  const best = recommendations[0] ?? null;

  const handleStartRecommended = (item) => {
    setPlan({
      timerMode: item.mode.timerMode,
      minutes: item.mode.minutes,
      label: item.mode.title,
    });

    navigate("/timer");
  };

  return (
    <Card
      className={styles.smartContainer}
      data-theme={theme}
      style={{ padding: 20 }}
    >
      <Box style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className={styles.titleRow}>
          <Typography variant="h6" component="h4">
            Smart Recommendations
          </Typography>
        </div>

        <Typography variant="body1" color="muted">
          Current energy: {latestEnergy ?? "No data"} | Trend: {trend} |
          Available time: {availableMinutes} min
        </Typography>

        {!best ? (
          <>
            <Typography variant="h5" component="h2">
              Log your energy to get recommendations
            </Typography>
            <Typography variant="body1" color="muted">
              Go to the Energy page and save at least 1–2 energy logs.
            </Typography>
          </>
        ) : (
          <>
            <div
              style={{
                border: "1px solid var(--border-color, #d0d7de)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Typography variant="body1" color="muted">
                Best match right now
              </Typography>

              <Typography variant="h5" component="h2">
                {best.mode.title}
              </Typography>

              <Typography variant="body1" color="muted">
                {best.mode.description}
              </Typography>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: 14,
                }}
              >
                <span>Mode: {best.mode.timerMode}</span>
                <span>•</span>
                <span>Timer: {best.mode.minutes} min</span>
                <span>•</span>
                <span>Score: {best.score}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {best.reasons.map((reason, index) => (
                  <Typography key={index} variant="body1" color="muted">
                    • {reason}
                  </Typography>
                ))}
              </div>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 12,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleStartRecommended(best)}
                >
                  Start recommended session
                </Button>
              </Box>
            </div>

            {recommendations.length > 1 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <Typography variant="h6" component="h3">
                  Other good options
                </Typography>

                {recommendations.slice(1).map((item) => (
                  <div
                    key={item.mode.id}
                    style={{
                      border: "1px solid var(--border-color, #d0d7de)",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <Typography variant="h6" component="h4">
                      {item.mode.title}
                    </Typography>

                    <Typography variant="body1" color="muted">
                      {item.mode.description}
                    </Typography>

                    <Typography variant="body1" color="muted">
                      {item.mode.minutes} min • {item.mode.timerMode} • score{" "}
                      {item.score}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="muted"
                      style={{ marginTop: 8 }}
                    >
                      Why: {item.reasons[0]}
                    </Typography>

                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 10,
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => handleStartRecommended(item)}
                      >
                        Use this plan
                      </Button>
                    </Box>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        {logs.length > 0 ? <EnergyChart logs={logs} maxPoints={14} /> : null}
      </Box>
    </Card>
  );
}

export default SmartRecommendation;
