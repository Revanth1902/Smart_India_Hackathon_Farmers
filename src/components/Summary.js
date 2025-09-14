import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import useLanguage from "../hooks/useLanguage"; // Adjust path as needed

// Define translations for the component
const translations = {
  todaysSummary: {
    english: "Today's Summary",
    malayalam: "ഇന്നത്തെ സംക്ഷേപം",
  },
  alertText: {
    english: "Alert: Mildew risk (Zone 3)",
    malayalam: "അറിയിപ്പ്: മിൽഡ്യൂ അപകടം (സോൺ 3)",
  },
  upcomingText: {
    english: "Upcoming: Check irrigation (9 AM)",
    malayalam: "മുമ്പിൽ: ജലസേചനം പരിശോധിക്കുക (9 മണിക്ക്)",
  },
};

function SummaryBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const lang = useLanguage(); // Get current language from hook

  return (
    <Card
      sx={{
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
        p: 0,
        mt: 2,
        mx: isMobile ? 2 : 0,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 1 : 0,
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 0.5 }}
          >
            {translations.todaysSummary[lang]}
          </Typography>
          <Typography variant="body2" sx={{ color: "error.main" }}>
            {translations.alertText[lang]}
          </Typography>
        </Box>

        <Box mt={isMobile ? 1 : 0}>
          <Typography
            variant="body1"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {translations.upcomingText[lang]}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SummaryBar;
