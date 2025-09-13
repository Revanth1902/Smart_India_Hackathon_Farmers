import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Header from "../components/Navbar";
import {
  WelcomeCard,
  FarmInfoCard,
  WeatherAlertCard,
} from "../components/CardComponent";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/Recnets";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [farmerData, setFarmerData] = useState({
    name: "Farmer",
    farmLocation: null,
  });
  const [formattedDate, setFormattedDate] = useState("");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const { name, village, district, state } = storedUser;
      const locationParts = [village, district, state].filter(Boolean);
      const farmLocation = locationParts.join(", ");
      setFarmerData({
        name: name || "Farmer",
        farmLocation: farmLocation || null,
      });
    }
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError(
          "Location access denied. Enable location to get weather updates."
        );
      }
    );
  }, []);

  // Fetch weather from Open-Meteo
  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data.current_weather);
        const date = new Date(data.current_weather.time);
        const formatter = new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        setFormattedDate(formatter.format(date));
      } catch (error) {
        setWeather(null);
      }
    };

    fetchWeather();
  }, [coords]);

  return (
    <Box className="dashboard-container">
      <main className="dashboard-main">
        {/* Grid for cards */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr", // Mobile: single column
              md: "1fr 1fr", // Desktop: 2 columns
            },
            mb: 2,
          }}
        >
          <WelcomeCard name={farmerData.name} />

          {farmerData.farmLocation ? (
            <FarmInfoCard
              location={farmerData.farmLocation}
              temp={weather ? `${weather.temperature}°C` : "Loading..."}
              rainfall="N/A"
            />
          ) : (
            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                color: "gray",
                textAlign: "center",
              }}
            >
              No farm location saved. Please update your profile.
            </Box>
          )}

          {locationError ? (
            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                color: "orange",
                textAlign: "center",
              }}
            >
              {locationError}
            </Box>
          ) : weather ? (
            <WeatherAlertCard
              temp={`${weather.temperature}°C`}
              alert={weather.weathercode === 3 ? "Cloudy" : "Clear sky"}
              probability="N/A"
              date={formattedDate}
              location={farmerData.farmLocation}
            />
          ) : (
            <Box
              sx={{
                p: 2,
                textAlign: "center",
              }}
            >
              Loading weather info...
            </Box>
          )}

          <QuickActions />
        </Box>

        {/* RecentActivity Full Width */}
        <Box sx={{ mb: 2 }}>
          <RecentActivity />
        </Box>
      </main>
    </Box>
  );
};

export default Dashboard;
