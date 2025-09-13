import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { styled } from "@mui/system";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#2f855a", // Deep green
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
});

export default function Navbar() {
  const [weather, setWeather] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=13.0&longitude=77.625&current_weather=true"
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.current_weather);

        // ✅ Format the date
        const date = new Date(data.current_weather.time);
        const formatter = new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        setFormattedDate(formatter.format(date)); // e.g., "Saturday, 13 Sep 2025"
      })
      .catch(() => {
        setWeather(null);
        setFormattedDate("");
      });
  }, []);

  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingY: 1,
        }}
      >
        {/* App Branding */}
        <Box display="flex" alignItems="center" gap={1}>
          <AgricultureIcon sx={{ fontSize: 32, color: "#fffbe7" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontFamily: "'Exo 2', sans-serif",
              color: "#fff",
              letterSpacing: 1,
            }}
          >
            Krishi Sakhi
          </Typography>
        </Box>

        {/* Weather + Date */}
        <Box display="flex" alignItems="center">
          {weather ? (
            <Fade in={true} timeout={1000}>
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                {/* Weather Info (Top) */}
                <Box display="flex" alignItems="center" gap={1}>
                  <WbSunnyIcon sx={{ color: "#ffeb3b" }} />
                  <Typography sx={{ color: "#fff" }}>
                    {weather.temperature}°C • {weather.windspeed} km/h
                  </Typography>
                </Box>

                {/* Date (Bottom) */}
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", fontStyle: "italic", mt: 0.5 }}
                >
                  {formattedDate}
                </Typography>
              </Box>
            </Fade>
          ) : (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
