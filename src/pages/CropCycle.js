import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import paddyData from "../utils/paddy.json";

// Styled components...
const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "95%",
  margin: "1.5rem auto",
  backgroundColor: "transparent",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
    margin: "1rem auto",
    width: "95%",
    boxShadow: "none",
  },
}));

const CalendarPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  background: "#ffffff",
  "& .react-calendar": {
    width: "100%",
    border: "none",
    fontFamily: theme.typography.fontFamily,
  },

  "& .react-calendar__month-view__days": {
    gap: "4px 8px", // Controls vertical and horizontal spacing
  },

  "& .react-calendar__tile": {
    borderRadius: "8px",
    height: "70px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "4px",
    textAlign: "center",
    color: "#333",
  },
  "& .react-calendar__tile--now": {
    background: "#e6f5ff",
    border: `2px solid ${theme.palette.primary.main}`,
  },
  "& .react-calendar__tile--active": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  "& .react-calendar__month-view__weekdays__weekday": {
    textAlign: "center",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    "& .react-calendar__tile": {
      height: "55px",
    },
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

const CropDayLabel = styled(Typography)({
  fontSize: "0.7rem",
  fontWeight: "bold",
  marginTop: "4px",
});

// Utility functions
const sanitizeForClassName = (name) =>
  name.toLowerCase().replace(/[\s&]+/g, "-");

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const STORAGE_KEY = "paddyCropProgress";

const saveProgressToLocalStorage = (completedDay, flattenedData) => {
  const savedAt = new Date().toISOString();
  const completedDaysData = flattenedData.filter(
    (day) => day.globalDay <= completedDay
  );
  const uniquePhases = [
    ...new Set(completedDaysData.map((day) => day.phaseName)),
  ];
  const percentage =
    flattenedData.length > 0
      ? Math.round((completedDay / flattenedData.length) * 100)
      : 0;

  const dataToStore = {
    completedDay,
    savedAt,
    stagesCompleted: uniquePhases.length,
    percentage: `${percentage}%`,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
};

const getFlattenedPhases = (phases, startDate) => {
  const allDays = [];
  let currentDate = new Date(startDate);
  let globalDayCounter = 1;

  phases.forEach((phase) => {
    const sortedDetails = [...phase.daily_details].sort(
      (a, b) => a.day - b.day
    );
    for (let dayInPhase = 1; dayInPhase <= phase.days_required; dayInPhase++) {
      let relevantDetail = sortedDetails[0];
      for (const detail of sortedDetails) {
        if (detail.day <= dayInPhase) {
          relevantDetail = detail;
        } else {
          break;
        }
      }
      allDays.push({
        globalDay: globalDayCounter++,
        date: formatDate(currentDate),
        phaseName: phase.phase,
        subPhase: relevantDetail.sub_phase,
        description: relevantDetail.description,
        precautions: relevantDetail.precautions,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return allDays;
};

const CropTracker = () => {
  const theme = createTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoading, setIsLoading] = useState(true);
  const [cropStartDate] = useState(new Date("2025-08-27T12:00:00Z"));
  const [activeStartDate, setActiveStartDate] = useState(cropStartDate);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const flattenedData = useMemo(
    () => getFlattenedPhases(paddyData.phases, cropStartDate),
    [cropStartDate]
  );

  const dayDataMap = useMemo(
    () => new Map(flattenedData.map((item) => [item.date, item])),
    [flattenedData]
  );

  const todayString = formatDate(new Date());
  const todayData = dayDataMap.get(todayString);

  // ✅ Save progress to localStorage automatically (even without button click)
  useEffect(() => {
    if (todayData && flattenedData.length > 0) {
      saveProgressToLocalStorage(todayData.globalDay, flattenedData);
    }
  }, [todayData, flattenedData]);

  const totalDays = flattenedData.length;
  const currentDay = todayData ? todayData.globalDay : 0;
  const progressPercentage = totalDays > 0 ? (currentDay / totalDays) * 100 : 0;

  const phaseColorMap = {
    "Land Preparation": "#A5D6A7",
    "Nursery Preparation & Seeding": "#90CAF9",
    Transplanting: "#FFE082",
    "Vegetative Stage": "#CE93D8",
    "Reproductive Stage": "#FFAB91",
    "Maturity & Harvest": "#B0BEC5",
  };

  const generateCalendarStyles = () => {
    let styles = "";
    Object.keys(phaseColorMap).forEach((phase) => {
      const className = `phase--${sanitizeForClassName(phase)}`;
      styles += `
        .react-calendar__tile.${className} {
          background-color: ${phaseColorMap[phase]};
        }
        .react-calendar__tile.${className}:hover {
          opacity: 0.8  ;
        }
      `;
    });
    return <style>{styles}</style>;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      const dayData = dayDataMap.get(dateString);
      if (dayData) {
        return `phase--${sanitizeForClassName(dayData.phaseName)}`;
      }
    }
    return null;
  };

  const getTileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      const dayData = dayDataMap.get(dateString);
      if (dayData) {
        return <CropDayLabel>Day {dayData.globalDay}</CropDayLabel>;
      }
    }
    return null;
  };

  const handleDayClick = (date) => {
    const dateString = formatDate(date);
    const dayData = dayDataMap.get(dateString);
    setSelectedDay(dayData || null);
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      {generateCalendarStyles()}
      <CssBaseline />
      <MainContainer>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant={isSmallScreen ? "h5" : "h4"}
            component="h1"
            fontWeight="bold"
          >
            🌾 Paddy Crop Tracker
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Full schedule starting from {cropStartDate.toLocaleDateString()}
          </Typography>
        </Box>

        <CalendarPaper>
          <Calendar
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate)
            }
            value={new Date()}
            onClickDay={handleDayClick}
            tileClassName={getTileClassName}
            tileContent={getTileContent}
          />
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {paddyData.phases.map((phase) => (
              <LegendItem key={phase.phase}>
                <LegendColorBox
                  sx={{ backgroundColor: phaseColorMap[phase.phase] }}
                />
                <Typography variant="body2">{phase.phase}</Typography>
              </LegendItem>
            ))}
          </Box>
        </CalendarPaper>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: "12px",
            backgroundColor: "#F5F5F5",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crop Progress
          </Typography>
          <Box sx={{ position: "relative", display: "inline-flex", mb: 2 }}>
            <CircularProgress
              variant="determinate"
              value={progressPercentage}
              size={100}
              thickness={5}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" component="div">
                {`${Math.round(progressPercentage)}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Day {currentDay} of {totalDays}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: "12px",
            backgroundColor: "#F5F5F5",
          }}
        >
          {todayData ? (
            <>
              <Typography variant="h6" gutterBottom>
                Today's Activity (Day {todayData.globalDay})
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Phase: <strong>{todayData.phaseName}</strong>
              </Typography>
              <Typography variant="body2">
                <strong>Sub-phase:</strong> {todayData.subPhase}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {todayData.description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Precautions:</strong> {todayData.precautions}
              </Typography>
              <DialogActions>
                <Button
                  onClick={() => {
                    toast.success(
                      `Marked Day ${todayData?.globalDay} as completed`
                    );
                    setSelectedDay(null);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Mark as Completed
                </Button>
              </DialogActions>
            </>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              No scheduled crop activity for today.
            </Typography>
          )}
        </Paper>

        <Dialog
          open={Boolean(selectedDay)}
          onClose={() => setSelectedDay(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Details for Day {selectedDay?.globalDay}
            <IconButton
              aria-label="close"
              onClick={() => setSelectedDay(null)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedDay ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="h6">
                  Phase: <strong>{selectedDay.phaseName}</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Date:</strong> {selectedDay.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Sub-phase:</strong> {selectedDay.subPhase}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedDay.description}
                </Typography>
                <Typography variant="body1">
                  <strong>Precautions:</strong> {selectedDay.precautions}
                </Typography>
              </Box>
            ) : (
              <Typography>No data available for this day.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedDay(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="bottom-center" />
      </MainContainer>
    </ThemeProvider>
  );
};

export default CropTracker;
