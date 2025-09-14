import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MicIcon from "@mui/icons-material/Mic";
import useLanguage from "../hooks/useLanguage"; // Adjust path as needed
import { translations } from "../utils/translations"; // Adjust path as needed

function VoiceAssistantButton() {
  const lang = useLanguage();

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<MicIcon />}
        sx={{
          width: "100%",
          maxWidth: 400, // Max width for desktop
          py: 2,
          borderRadius: 2,
          fontWeight: "bold",
          fontSize: "1.1rem",
        }}
      >
        {translations.askWithVoice[lang]}
      </Button>
    </Box>
  );
}

export default VoiceAssistantButton;
