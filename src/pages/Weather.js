import React, { useEffect, useState } from "react";
import {
  Opacity,
  Thermostat,
  Thunderstorm,
  WaterDrop,
  WarningAmber,
} from "@mui/icons-material";
import "../styles/Weather.css";

const Loader = () => (
  <div className="loading">
    <div className="i"></div>
    <div className="a"></div>
    <div className="u"></div>
  </div>
);

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

const WeatherPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState({
    temperature: "--",
    humidity: "--",
    rainfall: "--",
  });
  const [forecast, setForecast] = useState([]);

  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const latitude = parseFloat(user?.latitude) || 17.737318;
  const longitude = parseFloat(user?.longitude) || 83.296256;
  const locationName = user?.village || "Your Location";

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,precipitation&daily=temperature_2m_max,precipitation_sum,weathercode&timezone=auto`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.current_weather) {
          setError("Weather data not available.");
          setLoading(false);
          return;
        }

        setCurrent({
          temperature: `${data.current_weather.temperature}°C`,
          humidity: data.hourly.relative_humidity_2m
            ? `${data.hourly.relative_humidity_2m[0]}%`
            : "--",
          rainfall: data.hourly.precipitation
            ? `${data.hourly.precipitation[0]} mm`
            : "--",
        });

        const forecastData = data.daily.time.slice(0, 3).map((date, index) => ({
          date: new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          temp: `${data.daily.temperature_2m_max[index]}°C`,
          condition: getWeatherDescription(data.daily.weathercode[index]),
          rainfall: data.daily.precipitation_sum[index],
        }));

        setForecast(forecastData);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch weather data.");
        setLoading(false);
      });
  }, [latitude, longitude]);

  return (
    <div className="weather-container">
      {/* Weather Card */}
      <div className="weather-card">
        <h3 className="card-title">
          <Thunderstorm fontSize="small" /> Weather Forecast - {locationName}
        </h3>
        <p className="card-sub">
          Current weather conditions and 3-day forecast
        </p>

        {loading ? (
          <Loader />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
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

            <div className="alert">
              <WarningAmber style={{ marginRight: "8px" }} />
              {forecast.some((d) => d.rainfall > 0)
                ? "Heavy rain expected today. Take precautions for your crops."
                : "No severe weather alerts."}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
