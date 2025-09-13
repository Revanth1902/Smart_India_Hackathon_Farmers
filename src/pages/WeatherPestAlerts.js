import React from "react";
import { Typography, Card, CardContent, List, ListItem } from "@mui/material";

const WeatherPestAlertsPage = () => {
  const alerts = [
    {
      type: "Weather",
      message: "Heavy Rain expected tomorrow.",
      level: "warning",
    },
    {
      type: "Pest",
      message: "Mildew risk detected in Zone 3.",
      level: "critical",
    },
    {
      type: "Weather",
      message: "Temperature drop expected: 18°C.",
      level: "info",
    },
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Weather & Pest Alerts
      </Typography>

      <List>
        {alerts.map((alert, index) => (
          <Card
            key={index}
            className="card"
            style={{
              marginTop: "1rem",
              borderLeft:
                alert.level === "critical"
                  ? "6px solid var(--alert-red)"
                  : alert.level === "warning"
                  ? "6px solid var(--accent-yellow)"
                  : "6px solid var(--primary-blue)",
            }}
          >
            <CardContent>
              <Typography variant="h6">{alert.type} Alert</Typography>
              <Typography>{alert.message}</Typography>
            </CardContent>
          </Card>
        ))}
      </List>
    </div>
  );
};

export default WeatherPestAlertsPage;
