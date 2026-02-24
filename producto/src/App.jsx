import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/nav/Navbar";
import navLinks from "./components/nav/navLinks";

import Insights from "./components/nav/pages/Insights";
import Energy from "./components/nav/pages/Energy";
import Projects from "./components/nav/pages/Projects";
import Sessions from "./components/nav/pages/Sessions";
import TimerPage from "./components/nav/pages/Timer";
import LoginForm from "./components/forms/LoginForm";
import Signup from "./components/nav/pages/Signup";
import Dashboard from "./components/nav/pages/Dashboard";
import Settings from "./components/Settings/Settings";


import { useAuthState } from "../src/contexts/AuthContext";

function App() {
  const { status } = useAuthState();

  const isLoggedIn = status === "authenticated";
  const isChecking = status === "loading";
  if (isChecking) return null;

  return (
    <div className="appShell">
      <Navbar links={navLinks} />

      <main className="appMain">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/insights"
            element={
              isLoggedIn ? <Insights /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/energy"
            element={
              isLoggedIn ? <Energy /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/projects"
            element={
              isLoggedIn ? <Projects /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/sessions"
            element={
              isLoggedIn ? <Sessions /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/timer"
            element={
              isLoggedIn ? <TimerPage /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/settings"
            element={
              isLoggedIn ? <Settings /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginForm />
              )
            }
          />

          <Route
            path="/signup"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
