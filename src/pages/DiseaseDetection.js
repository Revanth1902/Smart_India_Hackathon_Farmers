import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardMedia,
  Alert,
  Fade,
  Slide,
  Grow,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

import useLanguage from "../hooks/useLanguage"; // ✅ Import your hook
import { translations } from "../utils/translations"; // ✅ Import translations

// Disease info
const diseaseDatabase = {
  "Powdery Mildew": {
    precautions: [
      "Avoid overhead irrigation.",
      "Use resistant varieties.",
      "Apply fungicides early.",
    ],
  },
  "Leaf Rust": {
    precautions: [
      "Remove infected leaves.",
      "Use resistant crop varieties.",
      "Apply recommended fungicides.",
    ],
  },
  Blight: {
    precautions: [
      "Remove and destroy infected plants.",
      "Avoid excessive nitrogen fertilizer.",
      "Apply copper-based fungicides.",
    ],
  },
};

function mockDetectDisease(imageFile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const name = imageFile.name.toLowerCase();
      if (name.includes("rust")) resolve("Leaf Rust");
      else if (name.includes("mildew")) resolve("Powdery Mildew");
      else if (name.includes("blight")) resolve("Blight");
      else resolve(null); // no disease
    }, 1500);
  });
}

// Styled
const UploadCard = styled(Card)(({ theme }) => ({
  maxWidth: "100%",
  margin: "auto",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[6],
  },
}));

const ResultCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#f0f4c3",
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

export default function DiseaseDetector() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const language = useLanguage(); // ✅ Get current language

  const handleImageChange = (e) => {
    setDisease(null);
    setError("");
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDetect = async () => {
    setError("");
    setDisease(null);
    if (!image) {
      setError(
        language === "malayalam"
          ? "ദയവായി ഒരു ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക."
          : "Please upload an image first."
      );
      return;
    }

    setLoading(true);
    try {
      const detected = await mockDetectDisease(image);
      setDisease(detected);
    } catch (e) {
      setError(
        language === "malayalam"
          ? "രോഗം കണ്ടെത്തുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക."
          : "Failed to detect disease. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        🌿{" "}
        {language === "malayalam"
          ? "സസ്യ രോഗം കണ്ടെത്തൽ"
          : "Crop Disease Detector"}
      </Typography>

      <Typography
        variant="subtitle1"
        align="center"
        sx={{ mb: 4, color: "gray" }}
      >
        {language === "malayalam"
          ? "സസ്യരോഗങ്ങൾ കണ്ടെത്താൻ ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക."
          : "Upload a leaf image to detect potential diseases and get recommended actions."}
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <Box textAlign="center">
            <Button
              variant="contained"
              component="label"
              size="large"
              sx={{ mb: 3 }}
            >
              {language === "malayalam"
                ? "ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക"
                : "Upload Leaf Image"}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          {preview && (
            <Grow in timeout={500}>
              <UploadCard>
                <CardMedia
                  component="img"
                  image={preview}
                  alt="Uploaded Leaf"
                  sx={{
                    maxHeight: 350,
                    objectFit: "cover",
                    borderBottom: "4px solid #c5e1a5",
                  }}
                />
              </UploadCard>
            </Grow>
          )}

          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDetect}
              disabled={loading}
              sx={{ px: 5, py: 1.5, fontWeight: "bold" }}
            >
              {loading
                ? language === "malayalam"
                  ? "ശേഖരിക്കുന്നു..."
                  : "Detecting..."
                : language === "malayalam"
                ? "രോഗം കണ്ടെത്തുക"
                : "Detect Disease"}
            </Button>
          </Box>

          {error && (
            <Slide in direction="up" mountOnEnter unmountOnExit>
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            </Slide>
          )}

          {disease === null && !loading && image && (
            <Fade in timeout={500}>
              <Alert severity="info" sx={{ mt: 3 }}>
                {language === "malayalam"
                  ? "ഇമേജിൽ രോഗം കണ്ടെത്തിയില്ല."
                  : "No disease detected on the leaf."}
              </Alert>
            </Fade>
          )}

          {disease && (
            <Slide in direction="up" mountOnEnter unmountOnExit>
              <ResultCard elevation={4}>
                <Typography variant="h5" gutterBottom>
                  ✅{" "}
                  {language === "malayalam"
                    ? `കണ്ടെത്തിയ രോഗം: `
                    : `Disease Detected: `}
                  <Box component="span" fontWeight="bold">
                    {language === "malayalam"
                      ? translateDiseaseName(disease)
                      : disease}
                  </Box>
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  {language === "malayalam"
                    ? "ശുപാർശ ചെയ്യുന്ന മുൻകരുതലുകൾ:"
                    : "Recommended Precautions:"}
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  {diseaseDatabase[disease].precautions.map((tip, idx) => (
                    <li key={idx}>
                      <Typography variant="body1">
                        {language === "malayalam" ? translateTip(tip) : tip}
                      </Typography>
                    </li>
                  ))}
                </Box>
              </ResultCard>
            </Slide>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

// Optional: Malayalam translations for disease names
const translateDiseaseName = (name) => {
  const map = {
    "Powdery Mildew": "പൗഡറി മിൽഡ്യൂ",
    "Leaf Rust": "ഇല മുളകുരോഗം",
    Blight: "ബ്ലൈറ്റ്",
  };
  return map[name] || name;
};

// Optional: Translate some common tips (add more as needed)
const translateTip = (tip) => {
  const tipsMap = {
    "Avoid overhead irrigation.": "മുകളിലൂടെ വെള്ളം വിതറുന്നത് ഒഴിവാക്കുക.",
    "Use resistant varieties.": "രോഗപ്രതിരോധ ശേഷിയുള്ള ഇനം ഉപയോഗിക്കുക.",
    "Apply fungicides early.": "ഫംഗിസൈഡ് നേരത്തെ പ്രയോഗിക്കുക.",
    "Remove infected leaves.": "സംക്രമിച്ച ഇലകൾ നീക്കം ചെയ്യുക.",
    "Use resistant crop varieties.":
      "രോഗപ്രതിരോധ ശേഷിയുള്ള വിള ഇനങ്ങൾ ഉപയോഗിക്കുക.",
    "Apply recommended fungicides.": "ശുപാർശ ചെയ്ത ഫംഗിസൈഡ് ഉപയോഗിക്കുക.",
    "Remove and destroy infected plants.":
      "രോഗബാധിതമായ ചെടികൾ നീക്കി നശിപ്പിക്കുക.",
    "Avoid excessive nitrogen fertilizer.":
      "അതിർത്തി നൈട്രജൻ ഫർട്ടിലൈസർ ഒഴിവാക്കുക.",
    "Apply copper-based fungicides.": "കപ്പർ അടങ്ങിയ ഫംഗിസൈഡ് പ്രയോഗിക്കുക.",
  };
  return tipsMap[tip] || tip;
};
