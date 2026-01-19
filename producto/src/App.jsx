import "./App.css";
// import Button from "./components/button";
// import Card from "./components/cards/Card";
// import Upcoming from "./components/Upcoming/Upcoming";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Sidebar from "./components/Layout/mainlayout/Sidebar";
import TopHeader from "./components/Layout/mainlayout/TopHeader";
import KpiRow from "./components/Layout/rows/KpiRow";
import RecommendationBanner from "./components/Layout/RecommendationBanner";
import EnergyChartCard from "./components/Layout/EnergyChartCard";
import RightRail from "./components/Layout/mainlayout/RightRail";



function App() {
  // const upcomingEvents = [
  //   {
  //     id: 1,
  //     title: "Benjame's Playground",
  //     date: "2024-07-01",
  //     time: "13:00",
  //     description: "Playtime",
  //     color: "purple",
  //   },
  //   {
  //     id: 2,
  //     title: "Johannes Oatcows milked",
  //     date: "2024-07-05",
  //     time: "19:00",
  //     description: "Milky",
  //     color: "orange",
  //   },
  // ];


  const navItems = ["Dashboard", "Insights", "Projects", "Schedule", "Team"];
const statCards = [
  { id: 1, label: "Focus Time", value: "4h 20m", delta: "+15% vs yesterday", tone: "positive" },
  { id: 2, label: "Current Energy", value: "High", delta: "Optimal", tone: "positive" },
  { id: 3, label: "Completed", value: "12 / 16", delta: "Tasks", tone: "default" },
];
const upcomingEvents = [
  { id: 1, title: "UX Strategy Sync", time: "2:00 PM – 3:00 PM", description: "Design team • 4 attendees", color: "purple" },
  { id: 2, title: "Quick Lunch Break", time: "3:30 PM – 4:00 PM", description: "Self care • Restorative", color: "green" },
  { id: 3, title: "Deep Work: Coding", time: "4:30 PM – 6:00 PM", description: "Feature implementation", color: "orange" },
];
const activityItems = [
  { id: 1, label: "Completed Landing Page Mockup", time: "45m ago", tone: "success" },
  { id: 2, label: "Achieved daily 4-hour focus goal", time: "2h ago", tone: "success" },
  { id: 3, label: "Processed 14 inbox items", time: "Today, 10:15 AM", tone: "info" },
];

  






  return (
  //   <>
  //     {/* Sektion 1 */}
  //     <div style={{ padding: "2rem" }}>
  //       <h1>Button test</h1>

  //       <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
  //         <Button variant="primary" onClick={() => alert("Start button clicked!")}>
  //           Start
  //         </Button>

  //         <Button
  //           variant="secondary"
  //           onClick={() => alert("Pause button clicked!")}
  //         >
  //           Pause
  //         </Button>

  //         <Button variant="danger" onClick={() => alert("Stop button clicked!")}>
  //           Stop
  //         </Button>
  //       </div>
  //     </div>

  //     {/* Sektion 2 (Card + layout med Upcoming) */}
  //     <div style={{ display: "flex", justifyContent: "space-between", padding: "2rem", minHeight: "100vh" }}>
  //       <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
  //         <Card>
  //           <h2>Aktivt arbetsblock</h2>
  //           <p>25 minuter kvar</p>
  //           <button>Starta</button>
  //           <button>Pausa</button>
  //         </Card>

  //         {/* Om du vill ha en extra "Button test"-del här också (din andra version) */}
  //         <div>
  //           <h1>Button test</h1>

  //           <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
  //             <Button
  //               text="Start"
  //               variant="primary"
  //               onClick={() => alert("Start button clicked!")}
  //             />

  //             <Button
  //               text="Pause"
  //               variant="secondary"
  //               onClick={() => alert("Pause button clicked!")}
  //             />

  //             <Button
  //               text="Stop"
  //               variant="danger"
  //               onClick={() => alert("Stop button clicked!")}
  //             />
  //           </div>
  //         </div>
  //       </div>

  //       <aside style={{ width: "320px", padding: "1rem" }}>
  //         <Upcoming events={upcomingEvents} />
  //       </aside>
  //     </div>
  //   </>



  <>
  
   <DashboardLayout sidebar={<Sidebar navItems={navItems} activeIndex={0} />}>
      <div className="content-grid">
        <section className="content-main">
          <TopHeader
            dateLabel="Monday, Oct 23"
            greeting="Good morning, Alex"
            subtitle="Today is Monday, October 23rd"
          />
          <KpiRow items={statCards} />
          <RecommendationBanner
            eyebrow="Smart Recommendation"
            title="Peak Energy: High Intensity"
            body="Your focus is at its peak. This is the optimal window for complex problem solving. We suggest tackling “Finalize UX Audit & Architecture Review”."
          />
          <EnergyChartCard
            eyebrow="Energy Flow Profile"
            title="Based on rhythm and history"
          />
        </section>
        <RightRail events={upcomingEvents} activityItems={activityItems} />
      </div>
    </DashboardLayout>
  
  </>
 );
}

export default App;
