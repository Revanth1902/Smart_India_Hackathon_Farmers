import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  LocationOn,
  WbSunny,
  Opacity,
  Thunderstorm,
  Warning,
  CameraAlt,
  Chat,
  Cloud,
  ShowChart,
  Description,
  AccountCircle,
} from "@mui/icons-material";
import AgricultureIcon from "@mui/icons-material/Agriculture";

import { useNavigate } from "react-router-dom";
import useLanguage from "../hooks/useLanguage";
import { translations } from "../utils/translations"; // adjust path accordingly
import "../styles/Dashboard.css";

const Dashboard = () => {
  const language = useLanguage();

  // Loader component (simple spinner)
  const Loader = () => (
    <div className="loading" style={{ justifyContent: "center", padding: 20 }}>
      <div className="spinner" />
    </div>
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Safe parse user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  let farmerData = {
    name: "Farmer Anish",
    farmLocation: "Kerala",
  };

  if (user) {
    farmerData = {
      ...farmerData,
      userId: user.id,
      userName: user.name,
      mobile: user.mobile,
      state: user.state,
      district: user.district,
      village: user.village,
    };
  }

  const [weather, setWeather] = useState({
    temp: "--",
    rainfall: "--",
    humidity: "--",
    alert: translations.weather.noAlert[language],
  });

  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDate(formattedDate);

    setLoading(true);

    fetch("https://wttr.in/Kerala?format=j1")
      .then((res) => res.json())
      .then((data) => {
        const current = data.current_condition[0];
        const hourly = data.weather[0].hourly[0];

        setWeather({
          temp: `${current.temp_C}°C`,
          humidity: `${current.humidity}%`,
          // Use precipMM for rainfall amount (mm)
          rainfall: `${hourly.precipMM || "0"} mm`,
          alert:
            hourly.weatherDesc && hourly.weatherDesc[0]
              ? hourly.weatherDesc[0].value
              : translations.weather.noAlert[language],
        });

        setLoading(false);
      })
      .catch(() => {
        setWeather({
          temp: "--",
          rainfall: "--",
          humidity: "--",
          alert: translations.weather.error[language],
        });
        setLoading(false);
      });
  }, [language]);

  return (
    <Box
      className="dashboard-container"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('/BackgroundFram.jpg')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Welcome Section */}
      <section className="welcome-card" style={{ marginBottom: 24 }}>
        <div>
          <h2>
            {translations.welcome[language]},{" "}
            <span>{farmerData.userName || farmerData.name}!</span>
          </h2>
          <p>
            <LocationOn fontSize="small" /> {translations.myFarm[language]}:{" "}
            {farmerData.village && farmerData.district && farmerData.state
              ? `${farmerData.village}, ${farmerData.district}, ${farmerData.state}`
              : translations.locationMissing[language]}
          </p>
        </div>
        <div className="date-box" style={{ fontWeight: "bold" }}>
          {translations.todayDate[language]} {date}
        </div>
      </section>

      {/* Weather Section */}
      <section
        className="weather-carding"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: 12,
          padding: 16,
          maxWidth: 400,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: 32,
        }}
      >
        <div className="weather-header" style={{ marginBottom: 12 }}>
          <h3>{translations.weatherToday[language]}</h3>
          <span className="weather-sub" style={{ color: "#555" }}>
            {translations.currentConditions[language]}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <div
              className="weather-stats"
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: 6 }}
                title="Temperature"
              >
                <WbSunny style={{ color: "#fbc02d" }} /> {weather.temp}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: 6 }}
                title="Rainfall"
              >
                <Thunderstorm style={{ color: "#0288d1" }} /> {weather.rainfall}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: 6 }}
                title="Humidity"
              >
                <Opacity style={{ color: "#4caf50" }} /> {weather.humidity}
              </span>
            </div>
            <div
              className="weather-alert"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#d32f2f",
                fontWeight: "bold",
              }}
              title="Weather Alert"
            >
              <Warning />
              {weather.alert}
            </div>
          </>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="section-title">{translations.quickActions[language]}</h3>
        <div
          className="quick-actions"
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            marginTop: 12,
          }}
        >
          <div
            className="action-card diagnose-action"
            onClick={() => navigate("/dashboard/diagnose")}
          >
            <CameraAlt fontSize="large" style={{ color: "#6a1b9a" }} />
            <strong>{translations.diagnosePlant[language]}</strong>
            <p>{translations.diagnoseDesc[language]}</p>
          </div>
          <div
            className="action-card askbot-action"
            onClick={() => navigate("/dashboard/ask")}
          >
            <Chat fontSize="large" style={{ color: "#6a1b9a" }} />
            <strong>{translations.askBot[language]}</strong>
            <p>{translations.askBotDesc[language]}</p>
          </div>
          <div
            className="action-card landlease-action"
            onClick={() => navigate("/dashboard/land-lease")}
          >
            <AgricultureIcon fontSize="large" style={{ color: "#6a1b9a" }} />
            <strong>{translations.landLease[language]}</strong>
            <p>{translations.landLeaseDesc[language]}</p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-card" style={{ marginTop: 40 }}>
        <h3>{translations.recentActivity[language]}</h3>
        <p className="recent-sub">{translations.recentSub[language]}</p>
        <div
          className="recent-empty"
          style={{
            textAlign: "center",
            padding: 40,
            color: "#bbb",
            fontStyle: "italic",
          }}
        >
          <Description style={{ fontSize: 40, color: "rgb(106, 27, 154)" }} />
          <p>{translations.noRecent[language]}</p>
          <p>{translations.startBy[language]}</p>
        </div>
      </section>

      {/* Footer Cards */}
      <div
        className="dashboard-cards"
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 48,
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div
          className="card"
          onClick={() => navigate("/dashboard/weather")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <Cloud style={{ fontSize: 36, color: "#1976d2" }} />
          <p>{translations.weather[language]}</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/marketprice")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <ShowChart style={{ fontSize: 36, color: "#388e3c" }} />
          <p>{translations.marketPrices[language]}</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/schemes")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <Description style={{ fontSize: 36, color: "#f57c00" }} />
          <p>{translations.schemes[language]}</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/profile")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <AccountCircle style={{ fontSize: 36, color: "#6d4c41" }} />
          <p>{translations.profilesing[language]}</p>
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
