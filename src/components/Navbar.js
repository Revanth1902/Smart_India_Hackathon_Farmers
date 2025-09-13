// Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import "../styles/home.css";

export default function Navbar() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => setWeather(data.current_weather))
      .catch(() => setWeather(null));
  }, []);

  return (
    <AppBar position="static" className="navbar-farmer-theme">
      <Toolbar className="navbar-toolbar">
        <Box display="flex" alignItems="center" gap={1}>
          <AgricultureIcon />
          <Typography variant="h6" className="navbar-user">
            Krishi Sakhi
          </Typography>
        </Box>

        <Box className="navbar-weather">
          {weather ? (
            <Box display="flex" alignItems="center" gap={1}>
              <WbSunnyIcon />
              <Typography variant="body1">
                {weather.temperature}°C, {weather.windspeed} km/h
              </Typography>
            </Box>
          ) : (
            <CircularProgress size={20} color="inherit" />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
