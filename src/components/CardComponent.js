import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

// Reusable MapPreview component
const MapPreview = ({ location }) => {
  if (!location) return null;

  const query = encodeURIComponent(location);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // You can also replace backgroundImage with a real static map URL if you get a key,
  // but here we just use a light gray box with the link.
  return (
    <Box
      component="a"
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "inline-block",
        width: 200,
        height: 120,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
        cursor: "pointer",
        border: "1px solid #ccc",
        textDecoration: "none",
        position: "relative",
        backgroundColor: "#e0e0e0",
      }}
      title={`Open ${location} in Google Maps`}
    >
      {/* Optional: you can add a tiny overlay text */}
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
          userSelect: "none",
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

export const FarmInfoCard = ({ location, temp, rainfall }) => (
  <Card className="info-card farm-info-card">
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <LocationOnIcon />
        <Typography variant="h6">My Farm: {location}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <MapPreview location={location} />
        <Box>
          <Typography>Temp: {temp}</Typography>
          <Typography>
            <WaterDropIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />{" "}
            Rainfall: {rainfall}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const WeatherAlertCard = ({ temp, alert, probability }) => (
  <Card className="info-card weather-alert-card">
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <WbSunnyIcon />
        <Typography variant="h6">Weather Alert (Today)</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography>Temp: {temp}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <WarningAmberIcon color="warning" />
            <Typography>
              <b>Alert:</b> {alert}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ color: "text.secondary" }}>{probability}</Typography>
      </Box>
    </CardContent>
  </Card>
);
