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

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function Insights() {
  return <h1>Insights</h1>;
}

function Projects() {
  return <h1>Projects</h1>;
}

function Schedule() {
  return <h1>Schedule</h1>;
}

function Team() {
  return <h1>Team</h1>;
}

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
        <CalendarPopup />
        <Upcoming />
        <ActivityLog />
      </aside>
    </>
  );
}

export default App;
