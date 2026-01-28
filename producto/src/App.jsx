import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Nav/Navbar";
import navLinks from "./components/nav/navLinks";

import DashboardLayout from "./components/layout/DashboardLayout";
import Timer from "./components/timer/timer";

import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Schedule from "./components/nav/pages/Schedule";
import LoginForm from "./components/forms/LoginForm";

import { useAuthState } from "./contexts/AuthContext";

function App() {
  const { status } = useAuthState();

  let isLoggedIn = status === "authenticated";

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
            element={
              isLoggedIn ? (
                <DashboardLayout>
                  <Timer />
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
