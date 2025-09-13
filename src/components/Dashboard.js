import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardComponent from "./CardComponent";

import SproutIcon from "@mui/icons-material/LocalFlorist";
import FertilizerIcon from "@mui/icons-material/Gavel";
import DiseaseIcon from "@mui/icons-material/Search";
import WeatherIcon from "@mui/icons-material/CloudQueue";

function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="CROP ADVISORY"
            icon={SproutIcon}
            color="#E8F5E9"
            to="/crop-advisory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="FERTILIZER RECOMMENDATION"
            icon={FertilizerIcon}
            color="#E3F2FD"
            to="/fertilizer-recommendation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="DISEASE DETECTION"
            icon={DiseaseIcon}
            color="#FFEBEE"
            to="/disease-detection"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="WEATHER & PEST ALERTS"
            icon={WeatherIcon}
            color="#E1F5FE"
            to="/weather-pest-alerts"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
