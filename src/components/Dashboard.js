import React from "react";
import Box from "@mui/material/Box";
import {
  Settings,
  LocationOn,
  WbSunny,
  Opacity,
  Thunderstorm,
  Warning,
  CameraAlt,
  Spa,
  Chat,
  Cloud,
  ShowChart,
  Description,
  AccountCircle,
} from "@mui/icons-material";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const farmerData = {
    name: "Farmer Anish",
    farmLocation: "Kerala",
  };

  const weather = {
    temp: "29°C",
    rainfall: "5mm",
    humidity: "85%",
    alert: "Heavy rain expected",
  };

  const date = "9/14/2025";

  return (
    <Box
      className="dashboard-container"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('/BackgroundFram.jpg')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      {/* <header className="dashboard-header">
        <div>
          <h1 className="app-title">KRISHI SAKHI</h1>
          <span className="app-subtitle">Farming Assistant Dashboard</span>
        </div>
        <button className="settings-btn">
          <Settings />
        </button>
      </header> */}

      {/* Welcome Section */}
      <section className="welcome-card">
        <div>
          <h2>
            Welcome, <span>{farmerData.name}!</span>
          </h2>
          <p>
            <LocationOn fontSize="small" /> My Farm: {farmerData.farmLocation}
          </p>
        </div>
        <div className="date-box">Today’s Date {date}</div>
      </section>

      {/* Weather Section */}
      <section className="weather-carding">
        <div className="weather-header">
          <h3>Weather Today</h3>
          <span className="weather-sub">Current conditions</span>
        </div>
        <div className="weather-stats">
          <span>
            <WbSunny /> {weather.temp}
          </span>
          <span>
            <Thunderstorm /> {weather.rainfall}
          </span>
          <span>
            <Opacity /> {weather.humidity}
          </span>
        </div>
        <div className="weather-alert">
          <Warning /> {weather.alert}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <div
            className="action-card"
            onClick={() => navigate("/dashboard/diagnose")}
          >
            <CameraAlt fontSize="large" />
            <strong> Diagnose Plant Disease</strong>
            <p>Get AI-powered crop advisory</p>
          </div>
          {/* <div
            className="action-card"
            onClick={() => navigate("/dashboard/recommend")}
          >
            <Spa fontSize="large" />
            <strong> Get Crop Recommendation</strong>
            <p>Personalized fertilizer advice</p>
          </div> */}
          <div
            className="action-card"
            onClick={() => navigate("/dashboard/ask")}
          >
            <Chat fontSize="large" />
            <strong> Ask Bot</strong>
            <p>Chat with AI farming assistant</p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-card">
        <h3>Recent Activity</h3>
        <p className="recent-sub">
          Your latest farming queries and recommendations
        </p>
        <div className="recent-empty">
          <Description style={{ fontSize: 40, color: "#bbb" }} />
          <p>No recent activity</p>
          <p>Start by asking for crop advisory</p>
        </div>
      </section>

      {/* Footer */}
      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate("/dashboard/weather")}>
          <Cloud className="card-icon" />
          <p>Weather</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/marketprice")}
        >
          <ShowChart className="card-icon" />
          <p>Market Prices</p>
        </div>

        <div className="card" onClick={() => navigate("/dashboard/schemes")}>
          <Description className="card-icon" />
          <p>Schemes</p>
        </div>

        <div className="card" onClick={() => navigate("/dashboard/profile")}>
          <AccountCircle className="card-icon" />
          <p>Profile</p>
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
