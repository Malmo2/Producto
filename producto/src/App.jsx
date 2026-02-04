import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/nav/Navbar";
import navLinks from "./components/nav/navLinks";

// import DashboardLayout from "./components/layout/DashboardLayout";
// import Timer from "./components/timer/timer";

import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Schedule from "./components/nav/pages/Schedule";
import LoginForm from "./components/forms/LoginForm";
import Signup from "./components/nav/pages/Signup";
import Dashboard from "./components/nav/pages/Dashboard";
// import SmartRecommendation from "./components/smartRecommendation/SmartRecommendation";
// import EnergyLevel from "./components/energy/energyLevelBox/EnergyLevel";

import { useAuthState } from '../src/contexts/AuthContext';

function App() {
  const { status } = useAuthState();

  let isLoggedIn = status === "authenticated";
  const isChecking = status === 'loading';
  if (isChecking) return null;

  return (
    <div className="appShell">
      <Navbar links={navLinks} />

      <main className="appMain">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
            }
          />

          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/insights"
            element={
              isLoggedIn ? <Insights /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/projects"
            element={
              isLoggedIn ? <Projects /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/schedule"
            element={
              isLoggedIn ? <Schedule /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
            }
          />
          <Route path="/signup"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />}

          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
