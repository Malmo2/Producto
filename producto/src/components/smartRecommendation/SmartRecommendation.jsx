import { useMemo, useEffect, useState, useRef } from "react";
import { useEnergy } from "../energy/context/EnergyContext";
import { useTheme } from "../Darkmode/ThemeContext";
import styles from "./smartRecommendation.module.css";
import { EnergyChart } from "../energy/EnergyChart";
import { getEnergyTrend } from "../../utils/getEnergyTrend";
import { GetWorkRecommendations } from "../../utils/getWorkRecommendations";
import { useRecommendationPlan } from "../../contexts/RecommendationPlanContext";
import { Card, Typography, Box } from "../ui";

function SmartRecommendation() {
  const { theme } = useTheme();
  const { logs } = useEnergy();
  const { setPlan } = useRecommendationPlan();

  const [availableMinutes, setAvailableMinutes] = useState(() => {
    const raw = localStorage.getItem("customMinutes");
    const parsed = raw ? Number(raw) : 30;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
  });

  useEffect(() => {
    const handler = () => {
      const raw = localStorage.getItem("customMinutes");
      const parsed = raw ? Number(raw) : 30;
      setAvailableMinutes(Number.isFinite(parsed) && parsed > 0 ? parsed : 30);
    };

    window.addEventListener("customMinutesChanged", handler);
    return () => window.removeEventListener("customMinutesChanged", handler);
  }, []);

  const latestEnergy = logs[0]?.level ?? null;

  const trend = useMemo(() => {
    return getEnergyTrend(logs, 6);
  }, [logs]);

  const best = useMemo(() => {
    const recommendations = GetWorkRecommendations(latestEnergy, trend, availableMinutes);
    return recommendations[0] ?? null;
  }, [latestEnergy, trend, availableMinutes]);

  const title = "Smart Recommendations";

  const heading = best ? best.title : "Log your energy to get recommendations";
  const text = best
    ? `${best.description} (Trend: ${trend})`
    : "Go to Energy page and save at least 1–2 energy logs.";



  const lastKeyRef = useRef("");


  // AUTOMATIC SEND TO TIMER
  useEffect(() => {
    if (!best) return;

    const key = `${latestEnergy ?? "null"}-${trend}`;

    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    setPlan((prev) => {
      if (
        prev &&
        prev.timerMode === best.timerMode &&
        prev.minutes === best.minutes &&
        prev.label === best.title
      ) {
        return prev;
      }

      return {
        timerMode: best.timerMode,
        minutes: best.minutes,
        label: best.title,
      };
    });
  }, [best, latestEnergy, trend, setPlan]);

  return (
    <Card className={styles.smartContainer} data-theme={theme} style={{ padding: 20 }}>
      <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className={styles.titleRow}>
          <img alt="icon" className={styles.titleIcon} />
          <Typography variant="h6" component="h4">{title}</Typography>
        </div>

        <Typography variant="h5" component="h2">{heading}</Typography>
        <Typography variant="body1" color="muted">{text}</Typography>

        {logs.length > 0 ? <EnergyChart logs={logs} maxPoints={14} /> : null}
      </Box>
    </Card>
  );
}

export default SmartRecommendation;