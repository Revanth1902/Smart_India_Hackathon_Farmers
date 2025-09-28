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

// Map Open-Meteo weather codes to descriptions
const getWeatherDescription = (code) => {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] || "Unknown";
};

const Dashboard = () => {
  const language = useLanguage();
  const [previousChats, setPreviousChats] = useState([]);

  useEffect(() => {
    const storedChats = localStorage.getItem("previous_chats");
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats);
        setPreviousChats(parsedChats);
      } catch (error) {
        console.error("Failed to parse previous chats:", error);
      }
    }
  }, []);

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

  // Weather state
  const [weather, setWeather] = useState({
    temp: "--",
    rainfall: "--",
    humidity: "--",
    alert: translations.weather.noAlert[language],
  });

  const [date, setDate] = useState("");

  useEffect(() => {
    // 1. Date Formatting (Independent of API call)
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setDate(formattedDate);

    // 2. Stabilize Latitude/Longitude and Trigger Fetch
    // Use the actual primitive values for the dependency array
    const latitude = parseFloat(user?.latitude) || 10.8505;
    const longitude = parseFloat(user?.longitude) || 76.2711;

    setLoading(true);

    // Setup AbortController for fetch cleanup
    const controller = new AbortController();
    const signal = controller.signal;

    // Fetch from Open-Meteo API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation&timezone=auto`;

    fetch(url, { signal })
      .then((res) => {
        if (!res.ok) {
          // Throw an error to be caught by the .catch block
          throw new Error("Failed to fetch weather data.");
        }
        return res.json();
      })
      .then((data) => {
        // Check if the fetch was aborted before setting state
        if (signal.aborted) return;

        if (!data.current_weather) {
          setWeather({
            temp: "--",
            rainfall: "--",
            humidity: "--",
            alert: translations.weather.error[language],
          });
          return;
        }

        const current = data.current_weather;

        // Use optional chaining (?. and ?.[]) for safer data access
        const humidity = data.hourly?.relative_humidity_2m?.[0] ?? "--";
        // Set rainfall to 0 if null/undefined, otherwise use the value
        const rainfall = data.hourly?.precipitation?.[0] ?? 0;

        setWeather({
          temp: `${Math.round(current.temperature)}°C`, // Added rounding for clean temp
          humidity: `${humidity}%`,
          rainfall: `${rainfall} mm`,
          alert: getWeatherDescription(current.weathercode),
        });
      })
      .catch((err) => {
        // Ignore AbortError if fetch was cancelled on purpose
        if (err.name === "AbortError") return;

        console.error("Weather fetch error:", err);
        setWeather({
          temp: "--",
          rainfall: "--",
          humidity: "--",
          alert: translations.weather.error[language],
        });
      })
      .finally(() => {
        // Check if the fetch was aborted before setting state
        if (signal.aborted) return;
        setLoading(false);
      });

    // Cleanup function: Abort the fetch request if the dependencies change
    // or the component unmounts.
    return () => {
      controller.abort();
    };

    // FIX: Depend on primitive values (latitude, longitude) and language.
    // The effect will only re-run if one of these values changes.
  }, [
    language,
    user?.latitude, // Depend on primitive strings/numbers from user
    user?.longitude,
    setDate,
    setLoading,
    setWeather,
    translations, // Include all external dependencies as per React rules
    getWeatherDescription,
  ]);

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

      <section className="recent-card" style={{ marginTop: 40 }}>
        <h3>{translations.recentActivity[language]}</h3>
        <p className="recent-sub">{translations.recentSub[language]}</p>

        {previousChats.length === 0 ? (
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
        ) : (
          <ul className="recent-list">
            {previousChats.map((chat) => (
              <li
                key={chat.id}
                className="recent-item"
                onClick={() => navigate(`/dashboard/ask?chatId=${chat.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Description style={{ marginRight: 8, color: "#6a1b9a" }} />
                {chat.title}
              </li>
            ))}
          </ul>
        )}
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
          onClick={() => navigate("/dashboard/markets")}
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
