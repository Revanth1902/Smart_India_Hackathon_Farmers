import React from "react";
import { Button, Typography, Box } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import GrassIcon from "@mui/icons-material/Grass";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";

const actions = [
  { text: "Diagnose Plant Disease", icon: <CameraAltIcon />, to: "/diagnose" },
  { text: "Get Crop Recommendation", icon: <GrassIcon />, to: "/recommend" },
  { text: "Ask Bot", icon: <ForumIcon />, to: "/ask" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box className="quick-actions-section">
      <Typography variant="h6" className="section-title">
        Quick Actions
      </Typography>
      {actions.map((action) => (
        <Button
          key={action.text}
          variant="contained"
          startIcon={action.icon}
          className="action-button"
          onClick={() => navigate(action.to)}
        >
          {action.text}
        </Button>
      ))}
    </Box>
  );
};

export default QuickActions;
