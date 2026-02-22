

import { useEffect } from "react";
import { useAuthState } from "../../../contexts/AuthContext";
import { apiFetch } from "../../../lib/api";

import DashboardLayout from "../../layout/DashboardLayout"
import Timer from "../../timer/timer"
import SmartRecommendation from "../../smartRecommendation/SmartRecommendation"
import Header from "../../panels/Header";
import EnergyPage from "../../energy/EnergyPage";


function Dashboard() {
  const { token } = useAuthState();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const data = await apiFetch("/api/me");
        console.log("API /api/me:", data);
      } catch (e) {
        console.error("API error:", e);
      }
    })();
  }, [token]);



  return (
    <>
      <Header />
      <DashboardLayout>
        <EnergyPage />
        <Timer />
        <SmartRecommendation />
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
