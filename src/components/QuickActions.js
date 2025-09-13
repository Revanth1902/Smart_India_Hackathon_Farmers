import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GrassIcon from "@mui/icons-material/Grass";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import "../styles/QuickActions.css"; // Custom styling

const actions = [
  {
    text: "Diagnose Plant Disease",
    icon: <CameraAltIcon fontSize="large" />,
    to: "/diagnose",
  },
  {
    text: "Get Crop Recommendation",
    icon: <GrassIcon fontSize="large" />,
    to: "/recommend",
  },
  { text: "Ask Bot", icon: <ForumIcon fontSize="large" />, to: "/ask" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box className="quick-actions-wrapper">
      <Typography variant="h6" className="section-title">
        Quick Actions
      </Typography>

      <Box className="quick-actions-grid">
        {actions.map((action) => (
          <Paper
            key={action.text}
            className="quick-action-card"
            elevation={3}
            onClick={() => navigate(action.to)}
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
