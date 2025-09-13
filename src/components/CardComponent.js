import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import "../styles/Dashboard.css";

// ✅ Google Maps Preview Component
const MapPreview = ({ location }) => {
  if (!location) return null;

  const query = encodeURIComponent(location);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // Free static map image from OpenStreetMap via staticmap.openstreetmap.de
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${query}&zoom=14&size=300x150&maptype=mapnik`;

  return (
    <Box
      component="a"
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "inline-block",
        width: 300,
        height: 150,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
        cursor: "pointer",
        border: "1px solid #ccc",
        textDecoration: "none",
        position: "relative",
      }}
    >
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${location}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn maps-btn"
      >
        🗺️ View on Maps
      </a>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          fontSize: 12,
          textAlign: "center",
          py: 0.5,
        }}
      >
        View on Google Maps
      </Box>
    </Box>
  );
};

export const WelcomeCard = ({ name }) => (
  <Card className="info-card welcome-card">
    <CardContent>
      <Typography variant="h6">Welcome, Farmer {name}!</Typography>
    </CardContent>
  </Card>
);

// FarmInfoCard Component
export const FarmInfoCard = ({ location, temp, rainfall }) => {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    location
  )}&output=embed`;

  return (
    <Card className="info-card farm-info-card" style={{ position: "relative" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOnIcon />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            My Farm: {location}
          </Typography>
        </Box>

        {/* Embedded Map */}
        <Box
          sx={{
            height: 150,
            borderRadius: 8,
            overflow: "hidden",
            mb: 1,
            boxShadow: 1,
          }}
        >
          <iframe
            title="Google Maps Preview"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
          ></iframe>
        </Box>

        {/* External Google Maps Link */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn maps-btn"
          style={{
            textDecoration: "none",
            fontSize: "0.875rem",
            color: "#1976d2",
            fontWeight: "500",
          }}
        >
          🗺️ Open in Google Maps
        </a>
      </CardContent>
    </Card>
  );
};

export const WeatherAlertCard = ({ temp, alert, location, date }) => {
  return (
    <div className="weather-alert-card">
      {/* Sun and Cloud Animation */}
      <div className="weather-visuals">
        <div className="weather-cloud front">
          <span className="left-front" />
          <span className="right-front" />
        </div>
        <span className="weather-sunshine" />
        <span className="weather-sun" />
        <div className="weather-cloud back">
          <span className="left-back" />
          <span className="right-back" />
        </div>
      </div>

      {/* Card Header */}
      <div className="weather-card-header">
        <span>{location}</span>
        <span>{date}</span>
      </div>

      {/* Temp Display */}
      <span className="weather-temp">{temp}</span>

      {/* Alert Display */}
      <div className="weather-alert-box">
        <span>{alert}</span>
      </div>
    </div>
  );
};

export default WeatherAlertCard;
