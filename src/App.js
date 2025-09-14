import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";

// Components
import AuthWithOTP from "./components/AuthForm";
import Home from "./components/Homepage";
import LandingPage from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./components/Navbar";
import VoiceAssistantButton from "./components/VoiceAsssistant";
import SummaryBar from "./components/Summary";
import FooterNav from "./components/Footer";
import CropAdvisoryPage from "./pages/CropAdvisory";
import FertilizerRecommendationPage from "./pages/FertilizerRecommendation";
import DiseaseDetectionPage from "./pages/DiseaseDetection";
import WeatherPestAlertsPage from "./pages/WeatherPestAlerts";
import WelcomePage from "./components/WelcomePage";
import Homepage from "./components/Homepage";
import WeatherPage from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import Schemes from "./pages/Schemes";

const theme = createTheme({
  palette: {
    primary: { main: "#4CAF50" },
    secondary: { main: "#2196F3" },
    error: { main: "#F44336" },
    background: { default: "#f0f2f5", paper: "#ffffff" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none" } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

// Helper function to check cookie
const isAuthenticated = () => {
  const cookie = document.cookie.includes("authToken");
  return cookie;
};

const App = () => {
  const welcomeCompleted = localStorage.getItem("welcomeCompleted") === "true";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Redirect root to /welcome */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* Welcome Page */}
          <Route path="/welcome" element={<WelcomePage />} />

          {/* Auth route (only allowed if welcome is completed) */}
          <Route path="/auth" element={<AuthWithOTP />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    pb: "56px",
                  }}
                >
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="landing" element={<LandingPage />} />
                      <Route
                        path="crop-advisory"
                        element={<CropAdvisoryPage />}
                      />
                      <Route
                        path="fertilizer-recommendation"
                        element={<FertilizerRecommendationPage />}
                      />
                      <Route
                        path="disease-detection"
                        element={<DiseaseDetectionPage />}
                      />
                      <Route
                        path="weather-pest-alerts"
                        element={<WeatherPestAlertsPage />}
                      />
                      <Route
                        path="diagnose"
                        element={<DiseaseDetectionPage />}
                      />
                      <Route path="recommend" element={<CropAdvisoryPage />} />
                      <Route path="ask" element={<Homepage />} />
                      <Route path="weather" element={<WeatherPage />} />
                      <Route path="marketprice" element={<MarketPrices />} />
                      <Route path="schemes" element={<Schemes />} />
                    </Routes>
                  </Box>
                  <VoiceAssistantButton />
                  <SummaryBar />
                  <FooterNav />
                </Box>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
