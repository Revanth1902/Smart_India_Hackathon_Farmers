// This is a placeholder for your existing FooterNav component.
// You would integrate your component's code here.
import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function FooterNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  // Set the active navigation item based on the current path
  useEffect(() => {
    switch (location.pathname) {
      case "/landing":
        setValue(0);
        break;
      case "/crop-advisory": // Assuming Advisory maps to Crop Advisory for example
        setValue(1);
        break;
      case "/disease-detection": // Assuming Detect maps to Disease Detection
        setValue(2);
        break;
      case "/weather-pest-alerts": // Assuming Alerts maps to Weather & Pest Alerts
        setValue(3);
        break;
      default:
        setValue(0); // Default to home
        break;
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/landing");
        break;
      case 1:
        navigate("/crop-advisory");
        break;
      case 2:
        navigate("/disease-detection");
        break;
      case 3:
        navigate("/weather-pest-alerts");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", // Subtle shadow
        backgroundColor: "white",
      }}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Advisory" icon={<AssignmentIcon />} />
        <BottomNavigationAction label="Detect" icon={<SearchIcon />} />
        <BottomNavigationAction label="Alerts" icon={<NotificationsIcon />} />
      </BottomNavigation>
    </Box>
  );
}

export default FooterNav;
