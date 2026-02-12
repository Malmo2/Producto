

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/Darkmode/ThemeContext.jsx';
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SessionProvider } from './contexts/SessionContext';



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SessionProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </SessionProvider>
    </AuthProvider>
  </StrictMode>,
);
