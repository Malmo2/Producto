import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/Darkmode/ThemeContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SessionProvider } from "./contexts/SessionContext";
import { RecommendationPlanProvider } from "./contexts/RecommendationPlanContext";

import { EnergyProvider } from "./components/energy/context/EnergyContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EnergyProvider>
          <RecommendationPlanProvider>
            <SessionProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SessionProvider>
          </RecommendationPlanProvider>
        </EnergyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
