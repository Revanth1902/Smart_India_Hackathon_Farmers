import React from "react";
import { Box } from "@mui/material";
import "../styles/Dashboard.css";
import useLanguage from "../hooks/useLanguage"; // Your custom hook

const translations = {
  viewOnMaps: {
    english: "🗺️ View on Maps",
    malayalam: "🗺️ نقشയിൽ കാണുക",
  },
  viewOnGoogleMaps: {
    english: "View on Google Maps",
    malayalam: "ഗൂഗിൾ മാപ്പിൽ കാണുക",
  },
  welcome: {
    english: "Welcome, Farmer",
    malayalam: "സ്വാഗതം, കർഷകനെ",
  },
  thriving: {
    english: "Hope your farm is thriving today! 🌱",
    malayalam: "ഇന്ന് നിങ്ങളുടെ ഫാം തളിർക്കുകയാണ് എന്ന് പ്രതീക്ഷിക്കുന്നു! 🌱",
  },
  myFarm: {
    english: "My Farm",
    malayalam: "എന്റെ ഫാം",
  },
};

const MapPreview = ({ location }) => {
  const lang = useLanguage();

  if (!location) return null;

  const query = encodeURIComponent(location);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

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
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn maps-btn"
      >
        {translations.viewOnMaps[lang]}
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
        {translations.viewOnGoogleMaps[lang]}
      </Box>
    </Box>
  );
};

export const WelcomeCard = ({ name }) => {
  const lang = useLanguage();

  return (
    <div className="dashboard-welcome-card">
      <div className="dashboard-welcome-img"></div>

      <div className="dashboard-welcome-textbox">
        <div className="dashboard-welcome-textcontent">
          <p className="dashboard-welcome-title">
            {translations.welcome[lang]}, {name}!
          </p>
        </div>
        <p className="dashboard-welcome-subtext">
          {translations.thriving[lang]}
        </p>
      </div>
    </div>
  );
};

export const FarmInfoCard = ({ location }) => {
  const lang = useLanguage();
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    location
  )}&output=embed`;

  return (
    <div className="farm-card">
      {/* Map section */}
      <div className="farm-card-map">
        <iframe
          title="Google Maps Preview"
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>

      {/* Content section */}
      <div className="farm-card-content">
        <h3 className="farm-card-title">
          {translations.myFarm[lang]}: {location}
        </h3>
      </div>

      {/* Button section */}
      <div className="farm-card-footer">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            location
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="farm-card-button"
        >
          {translations.viewOnMaps[lang]}
        </a>
      </div>
    </div>
  );
};

export const WeatherAlertCard = ({ temp, alert, location, date }) => {
  const lang = useLanguage();

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
