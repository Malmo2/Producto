import "./App.css";
import Button from "./components/button/button";
import Card from "./components/cards/Card";
import Timer from "./components/timer/timer";

import Upcoming from "./components/Upcoming/Upcoming";
import ActivityLog from "./components/Activitylog/Activitylog";
import CalendarPopup from "./components/Calendar/Calendar";

import Navbar from "./components/Nav/Navbar";
import navLinks from "./components/Nav/navLinks";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/nav/pages/Dashboard";
import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Schedule from "./components/nav/pages/Schedule";
import Team from "./components/nav/pages/Team";

function App() {
  return (
    <>
      <Navbar links={navLinks} />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/team" element={<Team />} />
      </Routes>

      <Card>
        <Button>Hejhej</Button>
        <Button>Hejhej</Button>
        <Button>Hejhej</Button>
        <Button>Hejhej</Button>
      </Card>

      <Timer />

      <aside className="aside-panel">
        <div className="sidebar-box">
          <CalendarPopup />
          <Upcoming />
          <ActivityLog />
        </div>
      </aside>
    </>
  );
}

export default App;
