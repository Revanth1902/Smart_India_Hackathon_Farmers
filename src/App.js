import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import AuthWithOTP from "./components/AuthForm";
import Home from "./components/Homepage";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "./components/Dashboard"; // fixed typo: LandindgPage -> LandingPage

// Your existing MUI components
import Header from "./components/Navbar";
import VoiceAssistantButton from "./components/VoiceAsssistant";
import SummaryBar from "./components/Summary";
import FooterNav from "./components/Footer";

// Example pages from your first code snippet
import CropAdvisoryPage from "./pages/CropAdvisory";
import FertilizerRecommendationPage from "./pages/FertilizerRecommendation";
import DiseaseDetectionPage from "./pages/DiseaseDetection";
import WeatherPestAlertsPage from "./pages/WeatherPestAlerts";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    secondary: {
      main: "#2196F3",
    },
    error: {
      main: "#F44336",
    },
    background: {
      default: "#f0f2f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public route for Authentication */}
          <Route path="/" element={<AuthWithOTP />} />

          {/* All protected routes share layout with Header, FooterNav, etc */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    pb: "56px", // space for fixed footer nav
                  }}
                >
                  <Header />
                  <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                    <Routes>
                      <Route path="home" element={<Home />} />
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
                      {/* Add more protected routes here */}
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
}

export default App;
