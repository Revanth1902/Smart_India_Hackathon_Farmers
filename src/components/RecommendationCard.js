import React from "react";
import { Paper, Typography, Button } from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import "../styles/home.css";
export default function RecommendationCard() {
  return (
    <Paper className="rec-card" elevation={1}>
      <div className="rec-top">
        <LocalFloristIcon fontSize="large" />
        <Typography variant="h6">Local Extension Services</Typography>
      </div>
      <Typography variant="body2" className="rec-desc">
        Get region-specific fertilizer & pest treatment tips. Upload leaf photo
        for faster diagnosis.
      </Typography>

      <div className="rec-actions">
        <Button size="small" variant="contained" color="primary">
          Ask Expert
        </Button>
        <Button size="small" variant="outlined">
          Resources
        </Button>
      </div>
    </Paper>
  );
}
