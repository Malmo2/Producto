import "./App.css";
import Button from "./components/button/button";
import Card from "./components/cards/Card";
// import Upcoming from "./components/Upcoming/Upcoming";
import Timer from "./components/timer/timer";

import Upcoming from "./components/Upcoming/Upcoming";
import ActivityLog from "./components/Activitylog/Activitylog";
import CalendarPopup from "./components/Calendar/Calendar";

import Navbar from "./components/Nav/Navbar";
import navLinks from "./components/Nav/navLinks";
import { Routes, Route, Navigate } from "react-router-dom";






function App() {


  return (
    <>

      <Navbar links={navLinks} />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <PublicRoute>
              <Dashboard />
            </PublicRoute>
          }
        />
        <Route
          path="/insights"
          element={
            <PublicRoute>
              <Insights />
            </PublicRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PublicRoute>
              <Projects />
            </PublicRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <PublicRoute>
              <Schedule />
            </PublicRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PublicRoute>
              <Team />
            </PublicRoute>
          }
        />
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
