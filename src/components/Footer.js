import React, { useEffect, useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
import useLanguage from "../hooks/useLanguage"; // Import your language hook

const translations = {
  home: {
    english: "Home",
    malayalam: "ഹോം",
  },
  // advisory: {
  //   english: "Advisory",
  //   malayalam: "അഡ്വൈസറി",
  // },
  detect: {
    english: "Detect",
    malayalam: "ഡിറ്റക്റ്റ്",
  },
  alerts: {
    english: "Alerts",
    malayalam: "അലർട്ട്സ്",
  },
  chatbot: {
    english: "Chatbot",
    malayalam: "ചാറ്റ്ബോട്ട്",
  },
};

function FooterNav() {
  const lang = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case "/dashboard/landing":
        setValue(0);
        break;
      case "/dashboard/disease-detection":
        setValue(1);
        break;
      case "/dashboard/weather-pest-alerts":
        setValue(2);
        break;
      case "/dashboard/":
        setValue(3);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // switch (newValue) {
    //   case 0:
    //     navigate("/dashboard/landing");
    //     break;
    //   case 1:
    //     navigate("/dashboard/crop-advisory");
    //     break;
    //   case 2:
    //     navigate("/dashboard/disease-detection");
    //     break;
    //   case 3:
    //     navigate("/dashboard/weather-pest-alerts");
    //     break;
    //   default:
    //     navigate("/");
    //     break;
    // }
    switch (newValue) {
      case 0:
        navigate("/dashboard/landing");
        break;
      case 1:
        navigate("/dashboard/disease-detection");
        break;
      case 2:
        navigate("/dashboard/weather-pest-alerts");
        break;
      case 3:
        navigate("/dashboard/weather-pest-alerts");
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
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        backgroundColor: "white",
      }}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction
          label={translations.home[lang]}
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label={translations.detect[lang]}
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          label={translations.alerts[lang]}
          icon={<NotificationsIcon />}
        />
        <BottomNavigationAction
          label={translations.chatbot[lang]}
          icon={<AssignmentIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default FooterNav;
