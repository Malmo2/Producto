import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/nav/Navbar";
import navLinks from "./components/nav/navLinks";

import DashboardLayout from "./components/layout/DashboardLayout";
import Timer from "./components/timer/timer";
import { SessionProvider } from "./contexts/SessionContext";

import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Sessions from "./components/nav/pages/Sessions";
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
    <SessionProvider>
      <div className="appShell">
        <Navbar
          links={navLinks}
          userEmail={auth.userEmail}
          onLogout={handleLogout}
          isLoggedIn={auth.isLoggedIn}
        />

        <main className="appMain">
          <Routes>
            <Route
              path="/"
              element={
                auth.isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginForm onLoginSuccess={handleLogin} />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                auth.isLoggedIn ? (
                  <DashboardLayout>
                    <Timer />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                auth.isLoggedIn ? (
                  <DashboardLayout>
                    <div className="topRow">
                      <EnergyLevel />
                      <Timer />
                    </div>
                    <SmartRecommendation />
                  </DashboardLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/insights"
              element={
                auth.isLoggedIn ? (
                  <Insights />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/projects"
              element={
                auth.isLoggedIn ? (
                  <Projects />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/schedule"
              element={
                auth.isLoggedIn ? (
                  <Schedule />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="/login"
              element={
                auth.isLoggedIn ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginForm onLoginSuccess={handleLogin} />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </SessionProvider>
  );
}

export default App;
