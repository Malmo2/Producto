// import { useEffect } from "react";
// import { useAuthState } from "../contexts/AuthContext";
// import { apiFetch } from "../lib/api";

// function Dashboard() {
//   const { token } = useAuthState();

//   useEffect(() => {
//     if (!token) return;

//     (async () => {
//       try {
//         const data = await apiFetch("/api/me", token);
//         console.log("API /api/me:", data);
//       } catch (e) {
//         console.error("API error:", e);
//       }
//     })();
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;

//     (async () => {
//       try {
//         const data = await apiFetch("/api/sessions", token);
//         console.log("GET /api/sessions:", data);
//       } catch (e) {
//         console.error("API error:", e);
//       }
//     })();
//   }, [token]);

//   useEffect(() => {
//     if (!token) return;

//     (async () => {
//       try {
//         const created = await apiFetch("/api/sessions", token, {
//           method: "POST",
//           body: JSON.stringify({
//             title: "Testpass",
//             category: "Deep Work",
//             startAt: new Date().toISOString(),
//             endAt: null,
//           }),
//         });

//         console.log("POST /api/sessions:", created);
//       } catch (e) {
//         console.error("failed post", e);
//       }
//     })();
//   }, [token]);

//   return <h1>Youre on the dashboard page.</h1>;
// }

// export default Dashboard;


// DashboardPage.tsx
import { useEffect } from "react";
import { useAuthState } from "../../../contexts/AuthContext";
import { apiFetch } from "../../../lib/api";

import DashboardLayout from "../../layout/DashboardLayout"
import Timer from "../../timer/timer"
import SmartRecommendation from "../../smartRecommendation/SmartRecommendation"
import Header from "../../panels/Header";


function Dashboard() {
  const { token } = useAuthState();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const data = await apiFetch("/api/me", token);
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
        <Timer />
        <SmartRecommendation />
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
