import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Nav/Navbar";
import navLinks from "./components/Nav/navLinks";

import DashboardLayout from "./components/layout/DashboardLayout";
import Timer from "./components/timer/timer";

import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Schedule from "./components/nav/pages/Schedule";
import LoginForm from "./components/forms/LoginForm";

function App() {
  const STORAGE_KEY = "auth";
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isLoggedIn: false, userEmail: "" };

    try {
      const saved = JSON.parse(raw);
      return {
        isLoggedIn: Boolean(saved?.isLoggedIn),
        userEmail: saved?.userEmail || "",
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return { isLoggedIn: false, userEmail: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (email) => {
    setAuth({ isLoggedIn: true, userEmail: email });
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, userEmail: "" });
    localStorage.removeItem(STORAGE_KEY);
    navigate("/login", { replace: true });
  };

  return (
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
            path="/insights"
            element={
              auth.isLoggedIn ? <Insights /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/projects"
            element={
              auth.isLoggedIn ? <Projects /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/schedule"
            element={
              auth.isLoggedIn ? <Schedule /> : <Navigate to="/login" replace />
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
  );
}

export default App;
