import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GrassIcon from "@mui/icons-material/Grass";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import { translations } from "../utils/translations";
import "../styles/QuickActions.css";

const QuickActions = ({ language }) => {
  const navigate = useNavigate();

  const actions = [
    {
      text: translations.actions.diagnose[language],
      icon: <CameraAltIcon fontSize="large" />,
      to: "/dashboard/diagnose",
    },
    {
      text: translations.actions.recommend[language],
      icon: <GrassIcon fontSize="large" />,
      to: "/dashboard/recommend",
    },
    {
      text: translations.actions.ask[language],
      icon: <ForumIcon fontSize="large" />,
      to: "/dashboard/ask",
    },
  ];

  return (
    <Box className="quick-actions-wrapper">
      <Typography variant="h6" className="section-title">
        {translations.quickActionsTitle[language]}
      </Typography>

      <Box className="quick-actions-grid">
        {actions.map((action) => (
          <Paper
            key={action.text}
            className="quick-action-card"
            elevation={3}
            onClick={() => navigate(action.to)}
            sx={{ cursor: "pointer" }}
          >
            <div className="icon">{action.icon}</div>
            <Typography variant="body1" className="label">
              {action.text}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default QuickActions;
