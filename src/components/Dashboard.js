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
  // States for user, location and weather data
  const [farmerData, setFarmerData] = useState({
    name: "Farmer",
    farmLocation: null,
  });

  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFarmerData({
        name: storedUser.name || "Farmer",
        farmLocation: storedUser.farmLocation || null,
      });
    }
  }, []);

  // Get user's current position
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

  // Fetch weather data when coords change
  useEffect(() => {
    if (!coords) return;

    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (error) {
        setWeather(null);
      }
    };

    fetchWeather();
  }, [coords]);

  return (
    <Box className="dashboard-container">
      <main className="dashboard-main">
        <WelcomeCard name={farmerData.name} />

        {/* Farm Location Card */}
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
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              color: "gray",
              textAlign: "center",
            }}
          >
            No farm location saved. Please update your profile.
          </Box>
        )}

        {/* Weather Alert Card */}
        {locationError ? (
          <Box
            sx={{
              p: 2,
              mb: 2,
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
            alert={weather.weathercode === 3 ? "Cloudy" : "Clear sky"} // Simplified alert
            probability="N/A"
          />
        ) : (
          <Box
            sx={{
              p: 2,
              mb: 2,
              textAlign: "center",
            }}
          >
            Loading weather info...
          </Box>
        )}

        <QuickActions />
        <RecentActivity />
      </main>
    </Box>
  );
};

export default Dashboard;
