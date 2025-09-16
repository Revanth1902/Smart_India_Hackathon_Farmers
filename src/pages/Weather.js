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

const WeatherPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState({
    temperature: "--",
    humidity: "--",
    rainfall: "--",
  });
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    fetch("https://wttr.in/Kerala?format=j1")
      .then((res) => res.json())
      .then((data) => {
        const currentCondition = data.current_condition[0];
        setCurrent({
          temperature: `${currentCondition.temp_C}°C`,
          humidity: `${currentCondition.humidity}%`,
          rainfall: data.weather[0].hourly[0].chanceofrain + " mm",
        });

        const forecastData = data.weather.slice(0, 3).map((day) => {
          const date = new Date(day.date);
          const formattedDate = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

          const midday =
            day.hourly.find((h) => h.time === "1200") || day.hourly[0];
          return {
            date: formattedDate,
            temp: `${midday.tempC}°C`,
            condition: midday.weatherDesc[0].value,
          };
        });
        setForecast(forecastData);

        setLoading(false);
        setError(null);
      })
      .catch(() => {
        setError("Failed to fetch weather data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="weather-container">
      {/* Weather Card */}
      <div className="weather-card">
        <h3 className="card-title">
          <Thunderstorm fontSize="small" /> Weather Forecast - Kerala
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
              {forecast.some((d) => d.condition.toLowerCase().includes("rain"))
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
