import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  List,
  CircularProgress,
  Box,
} from "@mui/material";

// --- Language Hook ---
const useLanguage = () => {
  const [language, setLanguage] = useState("english");

  useEffect(() => {
    const savedLang = localStorage.getItem("farmerLanguage");
    if (savedLang === "malayalam" || savedLang === "english") {
      setLanguage(savedLang);
    }
  }, []);

  return language;
};

// --- Weather Alert Logic ---
const getWeatherAlert = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 9)
    return {
      type: "Weather",
      level: "info",
      messages: {
        english: "Morning dew might increase mildew risk. Dry leaves early.",
        malayalam:
          "പുലർച്ചെ പെയ്ത്ത് മിൽഡ്യൂ രോഗ സാധ്യത ഉയർത്തുന്നു. ഇലകൾ ഉണക്കുക.",
      },
    };
  if (hour >= 12 && hour < 16)
    return {
      type: "Weather",
      level: "warning",
      messages: {
        english: "High afternoon temperatures. Ensure proper irrigation.",
        malayalam: "ഉച്ച വേളയിൽ ചൂട് കൂടും. നന്നായി വെള്ളം കൊടുക്കുക.",
      },
    };
  if (hour >= 16 && hour < 20)
    return {
      type: "Weather",
      level: "critical",
      messages: {
        english: "Evening humidity rising — fungal risk in tomatoes.",
        malayalam: "വൈകുന്നേരം ഈർപ്പം കൂടുന്നു — തക്കാളിയിൽ ഫംഗസ് സാധ്യത.",
      },
    };

  return {
    type: "Weather",
    level: "warning",
    messages: {
      english: "Night-time temperature drop may stress seedlings.",
      malayalam: "രാത്രിയിൽ താപനില കുറയുന്നു — തൈകൾക്ക് ക്ഷീണം ഉണ്ടാകും.",
    },
  };
};

// --- Pest Alert Logic ---
const getPestAlert = () => {
  const pestEvents = [
    {
      level: "warning",
      messages: {
        english: "Aphid activity reported in nearby farms.",
        malayalam: "അടുത്ത ഫാമുകളിൽ ആഫിഡ് പ്രവണത കണ്ടെത്തിയിട്ടുണ്ട്.",
      },
    },
    {
      level: "info",
      messages: {
        english: "Low pest pressure today — no action needed.",
        malayalam: "ഇന്ന് കീടസംക്രമം കുറവാണ് — പ്രത്യേക നടപടിയില്ല.",
      },
    },
    {
      level: "critical",
      messages: {
        english: "Fungal spores detected — apply fungicide if needed.",
        malayalam:
          "ഫംഗൽ സ്പോർസ് കണ്ടെത്തിയിട്ടുണ്ട് — ആവശ്യമെങ്കിൽ ഫംഗിസൈഡ് ഉപയോഗിക്കുക.",
      },
    },
    {
      level: "warning",
      messages: {
        english: "Leaf miner risk in leafy vegetables this week.",
        malayalam: "ഈ ആഴ്ച ഇലക്കറികളിൽ ലീഫ് മൈനർ അപകടസാധ്യതയുണ്ട്.",
      },
    },
  ];

  const random = Math.floor(Math.random() * pestEvents.length);
  return {
    type: "Pest",
    ...pestEvents[random],
  };
};

// --- Main Component ---
const WeatherPestAlertsPage = () => {
  const language = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const weather = getWeatherAlert();
      const pest = getPestAlert();
      setAlerts([weather, pest]);
      setLoading(false);
    }, 1000);
  }, []);

  const titleText = {
    english: "Weather & Pest Alerts",
    malayalam: "കാലാവസ്ഥയും കീടങ്ങളും സംബന്ധിച്ച മുന്നറിയിപ്പുകൾ",
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        {titleText[language]}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {alerts.map((alert, index) => (
            <Card
              key={index}
              sx={{
                mt: 2,
                borderLeft: `6px solid ${
                  alert.level === "critical"
                    ? "#d32f2f"
                    : alert.level === "warning"
                    ? "#fbc02d"
                    : "#0288d1"
                }`,
                boxShadow: 3,
                transition: "0.3s ease",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color={
                    alert.level === "critical"
                      ? "error.main"
                      : alert.level === "warning"
                      ? "warning.main"
                      : "primary.main"
                  }
                >
                  {alert.type}{" "}
                  {language === "malayalam" ? "മുന്നറിയിപ്പ്" : "Alert"}
                </Typography>
                <Typography>{alert.messages[language]}</Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
};

export default WeatherPestAlertsPage;
