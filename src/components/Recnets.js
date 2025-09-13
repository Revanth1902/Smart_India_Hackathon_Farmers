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

const activities = [
  "Diagnosis: Tomato Yellow Leaf Curl Virus (Sept 13)",
  "Query: 'Best fertilizer for rice' (Sept 11)",
];

const RecentActivity = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box className="recent-activity-section">
      <Card className="info-card recent-activity-card">
        <Box className="recent-activity-header" onClick={() => setOpen(!open)}>
          <Typography variant="h6">Recent Activity</Typography>
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <CardContent className="recent-activity-content">
            <ul>
              {activities.map((activity, index) => (
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
