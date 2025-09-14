import React from "react";
import {
  Opacity,
  Thermostat,
  Thunderstorm,
  WaterDrop,
  WarningAmber,
} from "@mui/icons-material";
import "../styles/Weather.css";

const WeatherPage = () => {
  const current = {
    temperature: "29°C",
    humidity: "85%",
    rainfall: "5mm",
  };

  const forecast = [
    { date: "9/15/2024", temp: "28°C", condition: "Light rain" },
    { date: "9/16/2024", temp: "30°C", condition: "Sunny" },
    { date: "9/17/2024", temp: "27°C", condition: "Heavy rain" },
  ];

  return (
    <div className="weather-container">
      {/* Header */}
      <header className="weather-header">
        <div className="logo">
          <Thunderstorm className="logo-icon" />
          <span className="logo-text">KRISHI SAKHI</span>
        </div>
        <span className="subtitle">Weather Forecast</span>
      </header>

      {/* Weather Card */}
      <div className="weather-card">
        <h3 className="card-title">
          <Thunderstorm fontSize="small" /> Weather Forecast - Kerala
        </h3>
        <p className="card-sub">
          Current weather conditions and 3-day forecast
        </p>

        {/* Current Conditions */}
        <div className="current-conditions">
          <div className="condition">
            <Thermostat style={{ color: "#FF5722" }} />
            <span>
              <strong>{current.temperature}</strong>
              <br />
              Temperature
            </span>
          </div>
          <div className="condition">
            <WaterDrop style={{ color: "#2979FF" }} />
            <span>
              <strong>{current.humidity}</strong>
              <br />
              Humidity
            </span>
          </div>
          <div className="condition">
            <Opacity style={{ color: "#00ACC1" }} />
            <span>
              <strong>{current.rainfall}</strong>
              <br />
              Rainfall
            </span>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <h4 className="forecast-title">3-Day Forecast</h4>
        <div className="forecast">
          {forecast.map((day, index) => (
            <div key={index} className="forecast-card">
              <p className="forecast-date">{day.date}</p>
              <Thunderstorm style={{ color: "#2979FF" }} />
              <p className="forecast-temp">{day.temp}</p>
              <p className="forecast-cond">{day.condition}</p>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="alert">
          <WarningAmber style={{ marginRight: "8px" }} />
          Heavy rain expected today. Take precautions for your crops.
        </div>
      </div>

      {/* Footer Badge */}
      <div className="footer-badge">⚡ Made with Emergent</div>
    </div>
  );
};

export default WeatherPage;
