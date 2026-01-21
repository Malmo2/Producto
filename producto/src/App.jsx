import "./App.css";
import { useState } from 'react';
import Button from "./components/button/button";
import Card from "./components/cards/Card";
import Timer from "./components/timer/timer";

import Upcoming from "./components/Upcoming/Upcoming";
import ActivityLog from "./components/Activitylog/Activitylog";
import CalendarPopup from "./components/Calendar/Calendar";

import Navbar from "./components/Nav/Navbar";
import navLinks from "./components/Nav/navLinks";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./components/nav/pages/Dashboard";
import Insights from "./components/nav/pages/Insights";
import Projects from "./components/nav/pages/Projects";
import Schedule from "./components/nav/pages/Schedule";
import Team from "./components/nav/pages/Team";


import TimerWithReducer from "./components/timer/TimerWithReducer";
import LoginForm from "./components/forms/LoginForm";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    navigate('/dashboard', { replace: true });
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('')
    navigate('/login', { replace: true });
  }


  return (
    <div className="appShell">
      <Navbar links={navLinks} userEmail={userEmail} onLogout={handleLogout} isLoggedIn={isLoggedIn} />

      <main className="appMain">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm onLoginSuccess={handleLogin} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/insights" element={isLoggedIn ? <Insights /> : <Navigate to="/login" replace />} />
          <Route path="/projects" element={isLoggedIn ? <Projects /> : <Navigate to="/login" replace />} />
          <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Navigate to="/login" replace />} />
          <Route path="/team" element={isLoggedIn ? <Team /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={handleLogin} />} />
        </Routes>

        {isLoggedIn && (
          <>
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



            <TimerWithReducer />


          </>
        )}
      </main>
    </div>
  );
}

export default App;
