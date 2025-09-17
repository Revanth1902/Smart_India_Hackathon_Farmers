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
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const Loader = () => (
    <div className="loading" style={{ justifyContent: "center", padding: 20 }}>
      <div className="i"></div>
      <div className="a"></div>
      <div className="u"></div>
    </div>
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Initial farmer data
  let farmerData = {
    name: "Farmer Anish",
    farmLocation: "Kerala",
  };

  // Load user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user data exists before using it
  if (user) {
    console.log("User loaded from localStorage:", user);

    // Add user data to farmerData
    farmerData = {
      ...farmerData,
      userId: user.id,
      userName: user.name,
      mobile: user.mobile,
      state: user.state,
      district: user.district,
      village: user.village,
    };

    console.log("Combined farmer data:", farmerData);
  } else {
    console.warn("No user found in localStorage.");
  }

  const [weather, setWeather] = useState({
    temp: "--",
    rainfall: "--",
    humidity: "--",
    alert: "No weather alert",
  });

  const [date, setDate] = useState("");

  useEffect(() => {
    // Format today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDate(formattedDate);

    // Start loading
    setLoading(true);

    // Fetch weather from wttr.in for Kerala (no API key needed)
    fetch("https://wttr.in/Kerala?format=j1")
      .then((res) => res.json())
      .then((data) => {
        // Current condition
        const current = data.current_condition[0];
        const hourly = data.weather[0].hourly[0];

        setWeather({
          temp: `${current.temp_C}°C`,
          humidity: `${current.humidity}%`,
          rainfall: `${hourly.chanceofrain || "0"} mm`,
          alert:
            hourly.weatherDesc && hourly.weatherDesc[0]
              ? hourly.weatherDesc[0].value
              : "No weather alert",
        });

        setLoading(false); // ✅ done loading
      })
      .catch((err) => {
        console.error("Weather fetch error:", err);
        setWeather({
          temp: "--",
          rainfall: "--",
          humidity: "--",
          alert: "Unable to load weather data",
        });
        setLoading(false); // ✅ even on error
      });
  }, []);

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
            Welcome, <span>{farmerData.userName}!</span>
          </h2>
          <p>
            <LocationOn fontSize="small" /> My Farm: {farmerData.village},
            {farmerData.district}, {farmerData.state} 
          </p>
        </div>
        <div className="date-box" style={{ fontWeight: "bold" }}>
          Today’s Date {date}
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
          <h3>Weather Today</h3>
          <span className="weather-sub" style={{ color: "#555" }}>
            Current conditions
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
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <WbSunny style={{ color: "#fbc02d" }} /> {weather.temp}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Thunderstorm style={{ color: "#0288d1" }} /> {weather.rainfall}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
            >
              <Warning />
              {weather.alert}
            </div>
          </>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="section-title">Quick Actions</h3>
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
            className="action-card"
            onClick={() => navigate("/dashboard/diagnose")}
            style={{
              cursor: "pointer",
              flex: "1 1 200px",
              backgroundColor: "#e0f7fa",
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b2ebf2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#e0f7fa")
            }
          >
            <CameraAlt fontSize="large" style={{ color: "#00796b" }} />
            <strong> Diagnose Plant Disease</strong>
            <p>Get AI-powered crop advisory</p>
          </div>
          <div
            className="action-card"
            onClick={() => navigate("/dashboard/ask")}
            style={{
              cursor: "pointer",
              flex: "1 1 200px",
              backgroundColor: "#f3e5f5",
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#ce93d8")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3e5f5")
            }
          >
            <Chat fontSize="large" style={{ color: "#6a1b9a" }} />
            <strong> Ask Bot</strong>
            <p>Chat with AI farming assistant</p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-card" style={{ marginTop: 40 }}>
        <h3>Recent Activity</h3>
        <p className="recent-sub">
          Your latest farming queries and recommendations
        </p>
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
          <p>No recent activity</p>
          <p>Start by asking for crop advisory</p>
        </div>
      </section>

      {/* Footer */}
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
          <p>Weather</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/marketprice")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <ShowChart style={{ fontSize: 36, color: "#388e3c" }} />
          <p>Market Prices</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/schemes")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <Description style={{ fontSize: 36, color: "#f57c00" }} />
          <p>Schemes</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/profile")}
          style={{ cursor: "pointer", textAlign: "center" }}
        >
          <AccountCircle style={{ fontSize: 36, color: "#6d4c41" }} />
          <p>Profile</p>
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
