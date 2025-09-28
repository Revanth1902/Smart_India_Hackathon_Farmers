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
        malayalam: "പുലർച്ചെ പെയ്ത്ത് മിൽഡ്യൂ സാധ്യത. ഇലകൾ ഉണക്കുക.",
      },
    };
  if (hour >= 12 && hour < 16)
    return {
      type: "Weather",
      level: "warning",
      messages: {
        english: "High afternoon temperatures. Ensure proper irrigation.",
        malayalam: "ഉച്ച ചൂട് കൂടും. വെള്ളം നന്നായി കൊടുക്കുക.",
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
        malayalam: "ഇന്ന് കീടസംക്രമം കുറവാണ് — നടപടിയില്ല.",
      },
    },
    {
      level: "critical",
      messages: {
        english: "Fungal spores detected — apply fungicide if needed.",
        malayalam: "ഫംഗൽ സ്പോർസ് കണ്ടെത്തിയിട്ടുണ്ട് — ഫംഗിസൈഡ് ഉപയോഗിക്കുക.",
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

// --- Loan Alert Logic ---
const getLoanAlerts = (loans) => {
  const today = new Date();
  const alerts = [];

  for (const loan of loans) {
    const dueDate = new Date(loan.next_payment_due_date);
    const diffInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffInDays >= 0 && diffInDays <= 10) {
      alerts.push({
        type: "Loan",
        level: "warning",
        messages: {
          english: `Loan payment for "${
            loan.loan_purpose
          }" of ₹${loan.emi_installment_amount.toFixed(
            2
          )} is due in ${diffInDays} day(s).`,
          malayalam: `"${
            loan.loan_purpose
          }" ലോണിന് ₹${loan.emi_installment_amount.toFixed(
            2
          )} അടവ് ${diffInDays} ദിവസത്തിനുള്ളിൽ നല്‍കണം.`,
        },
      });
    }
  }

  return alerts;
};

// --- Sample Loan Data ---
// --- Sample Loan Data (Updated with upcoming dues) ---
const initialLoans = [
  {
    loan_id: "FCL-00142",
    farmer_name: "Priya Sharma",
    loan_purpose: "Crop Production (Wheat)",
    loan_amount: 150000,
    loan_currency: "INR",
    loan_date_taken: "2024-06-10",
    interest_rate_pa: 4.0,
    loan_term_years: 1.5,
    repayment_frequency: "Monthly",
    emi_installment_amount: 8658.74,
    monthly_due_date: 5,
    total_payments_made: 3,
    total_amount_paid: 25976.22,
    principal_outstanding: 125830.4,
    next_payment_due_date: "2025-10-03", // in 5 days
  },
  {
    loan_id: "FEL-00305",
    farmer_name: "Rajeev Singh",
    loan_purpose: "Equipment Purchase (Tractor)",
    loan_amount: 750000,
    loan_currency: "INR",
    loan_date_taken: "2023-11-25",
    interest_rate_pa: 8.5,
    loan_term_years: 5,
    repayment_frequency: "Monthly",
    emi_installment_amount: 15447.88,
    monthly_due_date: 28,
    total_payments_made: 10,
    total_amount_paid: 154478.8,
    principal_outstanding: 631908.5,
    next_payment_due_date: "2025-10-07", // in 9 days
  },
  {
    loan_id: "FCL-00199",
    farmer_name: "Anita Kumar",
    loan_purpose: "Dairy Expansion",
    loan_amount: 50000,
    loan_currency: "INR",
    loan_date_taken: "2025-06-20",
    interest_rate_pa: 6.5,
    loan_term_years: 2,
    repayment_frequency: "Monthly",
    emi_installment_amount: 2123.67,
    monthly_due_date: 15,
    total_payments_made: 2,
    total_amount_paid: 4247.34,
    principal_outstanding: 45752.66,
    next_payment_due_date: "2025-10-10", // in 12 days (will still show if limit is 30)
  },
];

// --- Main Component ---
const WeatherPestAlertsPage = () => {
  const language = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const weather = getWeatherAlert();
      const pest = getPestAlert();
      const loanAlerts = getLoanAlerts(initialLoans);
      setAlerts([weather, pest, ...loanAlerts]);
      setLoading(false);
    }, 1000);
  }, []);

  const titleText = {
    english: "Weather, Pest & Loan Alerts",
    malayalam: "കാലാവസ്ഥ, കീടം, ലോൺ മുന്നറിയിപ്പുകൾ",
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
                  {alert.type === "Loan"
                    ? language === "malayalam"
                      ? "ലോൺ അടവ് മുന്നറിയിപ്പ്"
                      : "Loan Payment Alert"
                    : `${alert.type} ${
                        language === "malayalam" ? "മുന്നറിയിപ്പ്" : "Alert"
                      }`}
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
