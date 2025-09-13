import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CardComponent from "./CardComponent";

// Icons for the cards
import SproutIcon from "@mui/icons-material/LocalFlorist"; // Crop Advisory
import FertilizerIcon from "@mui/icons-material/Gavel"; // Changed to represent bag/fertilizer better (could be a custom SVG)
import DiseaseIcon from "@mui/icons-material/Search"; // Disease Detection
import WeatherIcon from "@mui/icons-material/CloudQueue"; // Weather & Pest Alerts (Cloud with rain/bug could be custom)

// For Fertilizer icon, assuming you might want to use a more specific icon:
// You might need to import a custom SVG or find a better Material Icon.
// For now, let's use Gavel as a placeholder or you can get a custom SVG
// Example using a custom SVG:
// const FertilizerBagIcon = (props) => (
//   <SvgIcon {...props}>
//     <path d="M12 2L6 5V18L12 22L18 18V5L12 2ZM12 19.5L8 16.5V6.5L12 3.5L16 6.5V16.5L12 19.5Z" />
//   </SvgIcon>
// );

function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="CROP ADVISORY"
            icon={SproutIcon}
            color="#E8F5E9" // Light green
            to="/crop-advisory"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="FERTILIZER RECOMMENDATION"
            icon={FertilizerIcon} // Consider a custom icon here
            color="#E3F2FD" // Light blue
            to="/fertilizer-recommendation"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="DISEASE DETECTION"
            icon={DiseaseIcon}
            color="#FFEBEE" // Light red
            to="/disease-detection"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CardComponent
            title="WEATHER & PEST ALERTS"
            icon={WeatherIcon}
            color="#E1F5FE" // Lighter blue
            to="/weather-pest-alerts"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
