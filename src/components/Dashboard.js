import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  WelcomeCard,
  FarmInfoCard,
  WeatherAlertCard,
} from "../components/CardComponent";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/Recnets";
import useLanguage from "../hooks/useLanguage";
import { translations } from "../utils/translations";

const Dashboard = () => {
  const language = useLanguage();

  const [farmerData, setFarmerData] = useState({
    name: "Farmer",
    farmLocation: null,
  });
  const [formattedDate, setFormattedDate] = useState("");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

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

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError(translations.locationDenied[language]);
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
        setLocationError(translations.locationDenied[language]);
      }
    );
  }, [language]);

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
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            mb: 2,
          }}
        >
          <WelcomeCard
            name={farmerData.name}
            text={translations.welcome[language]}
            subText={translations.thriving[language]}
          />

          {farmerData.farmLocation ? (
            <FarmInfoCard location={farmerData.farmLocation} />
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
              {translations.locationMissing[language]}
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
              alert={
                weather.weathercode === 3
                  ? translations.weatherAlert.cloudy[language]
                  : translations.weatherAlert.clear[language]
              }
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
              {translations.weatherLoading[language]}
            </Box>
          )}

          <QuickActions language={language} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <RecentActivity />
        </Box>
      </main>
    </Box>
  );
};

export default Dashboard;
