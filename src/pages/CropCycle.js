import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import paddyData from "../utils/paddy.json"; // 👈 Your JSON file

// --- Styled Components ---
const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 700,
  margin: "2rem auto",
  backgroundColor: "#f9fbf8",
  borderRadius: "16px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    margin: "1rem",
  },
}));

const CalendarPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  background: "#ffffff",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const DayCell = styled(Paper)(({ theme, bgcolor, iscurrent }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  aspectRatio: "1 / 1",
  borderRadius: "8px",
  backgroundColor: bgcolor,
  border:
    iscurrent === "true"
      ? `2px solid ${theme.palette.primary.main}`
      : "1px solid #eee",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const LegendItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const LegendColorBox = styled(Box)({
  width: "20px",
  height: "20px",
  borderRadius: "4px",
});

// --- Helper Function to Flatten Days with Phases ---
const getFlattenedPhases = (phases) => {
  let dayCounter = 1;
  return phases.flatMap((phase, index) => {
    return phase.daily_details.map((detail) => ({
      globalDay: dayCounter++,
      phaseName: phase.phase,
      subPhase: detail.sub_phase,
      description: detail.description,
      precautions: detail.precautions,
    }));
  });
};

// --- Main Component ---
const CropTracker = () => {
  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentDate] = useState(new Date("2025-09-28T12:00:00Z"));

  const flattened = getFlattenedPhases(paddyData.phases);
  const todayDay = currentDate.getDate(); // Assuming 1st = day 1
  const todayData = flattened[todayDay - 1];

  const getPhaseColor = (phaseName) => {
    // Assign unique color per phase (you can make this smarter)
    const colorMap = {
      "Land Preparation": "#A5D6A7",
      "Nursery Preparation & Seeding": "#90CAF9",
      Transplanting: "#FFE082",
      "Vegetative Stage": "#CE93D8",
      "Reproductive Stage": "#FFAB91",
      "Maturity & Harvest": "#B0BEC5",
    };
    return colorMap[phaseName] || "#f0f0f0";
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<Grid item xs={1.714} key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = flattened[day - 1];
      const bgcolor = dayData ? getPhaseColor(dayData.phaseName) : "#f0f0f0";

      calendarDays.push(
        <Grid item xs={1.714} key={day}>
          <DayCell
            elevation={day === today ? 3 : 0}
            bgcolor={bgcolor}
            iscurrent={day === today ? "true" : "false"}
          >
            <Typography variant="body2">{day}</Typography>
          </DayCell>
        </Grid>
      );
    }

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <>
        <Grid container spacing={1} sx={{ marginBottom: 1 }}>
          {dayLabels.map((day) => (
            <Grid item xs={1.714} key={day} sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1}>
          {calendarDays}
        </Grid>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainContainer>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            fontWeight="bold"
          >
            🌾 Paddy Crop Tracker
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Monitoring day-by-day activities
          </Typography>
        </Box>

        {/* Calendar */}
        <CalendarPaper>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" fontWeight={500}>
              September 2025
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Full lifecycle day mapping
            </Typography>
          </Box>

          {renderCalendar()}

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
            {paddyData.phases.map((phase) => (
              <LegendItem key={phase.phase}>
                <LegendColorBox
                  sx={{ backgroundColor: getPhaseColor(phase.phase) }}
                />
                <Typography variant="body2">
                  {phase.phase} ({phase.days_required} days)
                </Typography>
              </LegendItem>
            ))}
          </Box>
        </CalendarPaper>

        {/* Current Task Information */}
        <Paper
          elevation={0}
          sx={{ mt: 2, p: 2, borderRadius: "12px", backgroundColor: "#F5F5F5" }}
        >
          {todayData ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                📅 Day {todayDay}: <strong>{todayData.phaseName}</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Sub-phase:</strong> {todayData.subPhase}
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {todayData.description}
              </Typography>
              <Typography variant="body2">
                <strong>Precautions:</strong> {todayData.precautions}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No data for today.
            </Typography>
          )}
        </Paper>

        {/* Future Feature */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: "12px",
            backgroundColor: "#2E7D32",
            "&:hover": { backgroundColor: "#1B5E20" },
          }}
        >
          Mark as Completed
        </Button>
      </MainContainer>
    </ThemeProvider>
  );
};

export default CropTracker;
