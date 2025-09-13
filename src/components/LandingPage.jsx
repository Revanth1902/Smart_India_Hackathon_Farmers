import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

// Import your components
import Header from "./Navbar";
import Dashboard from "./Dashboard";
import VoiceAssistantButton from "./VoiceAsssistant";
import SummaryBar from "./Summary";
import FooterNav from "./Footer"; // Assume this is your existing component

// Example pages for routing (you'll create these)
import CropAdvisoryPage from "../pages/CropAdvisory";
import FertilizerRecommendationPage from "../pages/FertilizerRecommendation";
import DiseaseDetectionPage from "../pages/DiseaseDetection";
import WeatherPestAlertsPage from "../pages/WeatherPestAlerts";

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green from your image
    },
    secondary: {
      main: "#2196F3", // Blue
    },
    error: {
      main: "#F44336", // Red
    },
    background: {
      default: "#f0f2f5", // Light grey background
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
          textTransform: "none", // Prevent uppercase buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly rounded corners for cards
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS for consistent styling */}
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            pb: "56px", // Account for fixed bottom navigation
          }}
        >
          <Header />

          <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crop-advisory" element={<CropAdvisoryPage />} />
              <Route
                path="/fertilizer-recommendation"
                element={<FertilizerRecommendationPage />}
              />
              <Route
                path="/disease-detection"
                element={<DiseaseDetectionPage />}
              />
              <Route
                path="/weather-pest-alerts"
                element={<WeatherPestAlertsPage />}
              />
              {/* Add more routes as needed */}
            </Routes>
          </Box>

          <VoiceAssistantButton />
          <SummaryBar />
          {/* Your existing FooterNav component */}
          <FooterNav />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
