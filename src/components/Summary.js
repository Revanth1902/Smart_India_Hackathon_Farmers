import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function SummaryBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5", // Light grey background
        p: 2,
        borderTop: "1px solid #eee",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
      }}
    >
      <Box mb={isMobile ? 1 : 0}>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Today's Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "error.main" }}>
          Alert: Mildew risk (Zone 3)
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Upcoming: Check irrigation (9 AM)
        </Typography>
      </Box>
    </Box>
  );
}

export default SummaryBar;
