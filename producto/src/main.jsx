import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./components/ui/ui.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/Darkmode/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SessionProvider } from "./contexts/SessionContext";
import { RecommendationPlanProvider } from "./contexts/RecommendationPlanContext";
import { TimerProvider } from "./contexts/TimerContext";

import { EnergyProvider } from "./components/energy/context/EnergyContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RecommendationPlanProvider>
          <EnergyProvider>
            <SessionProvider>
              <TimerProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </TimerProvider>
            </SessionProvider>
          </EnergyProvider>
        </RecommendationPlanProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
