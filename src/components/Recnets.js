import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useLanguage from "../hooks/useLanguage";

const translations = {
  recentActivityTitle: {
    english: "Recent Activity",
    malayalam: "സമീപകാല പ്രവർത്തനം",
  },
  activities: {
    english: [
      "Diagnosis: Tomato Yellow Leaf Curl Virus (Sept 13)",
      "Query: 'Best fertilizer for rice' (Sept 11)",
    ],
    malayalam: [
      "രോഗനിർണയം: തക്കാളി മഞ്ഞ ഇല വളയ രോഗം (സെപ്റ്റംബർ 13)",
      "ചോദ്യങ്ങൾ: 'അരിപ്പാടത്തിന് മികച്ച കൊറുപ്പ്' (സെപ്റ്റംബർ 11)",
    ],
  },
};

const RecentActivity = () => {
  const lang = useLanguage();

  const [open, setOpen] = useState(true);

  return (
    <Box className="recent-activity-section">
      <Card className="info-card recent-activity-card">
        <Box
          className="recent-activity-header"
          onClick={() => setOpen(!open)}
          sx={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {translations.recentActivityTitle[lang]}
          </Typography>
          <IconButton size="small" aria-label="toggle recent activity">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <CardContent className="recent-activity-content">
            <ul>
              {translations.activities[lang].map((activity, index) => (
                <li key={index}>
                  <Typography>{activity}</Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
};

export default RecentActivity;
