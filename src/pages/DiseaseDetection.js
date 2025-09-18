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
import { CircularProgress } from "@mui/material";

import useLanguage from "../hooks/useLanguage"; // Your hook to get language

// Disease info with precautions
// Updated diseaseDatabase with fertilizers added
const diseaseDatabase = {
  "Banana Freckle": {
    scientificName: "Phyllostica cavendishii",
    precautions: [
      "Remove infected banana leaves.",
      "Use disease-free planting material.",
      "Apply recommended fungicides.",
    ],
    fertilizers: [
      "Balanced NPK fertilizer (10-10-10)",
      "Potassium-rich fertilizer",
      "Organic compost",
    ],
  },
  "Sheath Blight of Rice": {
    precautions: [
      "Maintain proper water management.",
      "Avoid dense planting to improve air circulation.",
      "Use fungicides as advised by experts.",
    ],
    fertilizers: [
      "Nitrogen fertilizer (Urea)",
      "Phosphorus fertilizer (Single Super Phosphate)",
      "Potassium fertilizer (Muriate of Potash)",
    ],
  },
  "Coconut Disease": {
    precautions: [
      "Remove and destroy affected fronds.",
      "Apply copper-based fungicides regularly.",
      "Ensure good soil drainage.",
    ],
    fertilizers: [
      "Coconut-specific NPK fertilizers",
      "Magnesium sulfate",
      "Organic mulch and compost",
    ],
  },
  "Rubber Disease": {
    precautions: [
      "Prune infected branches.",
      "Apply fungicides on affected trees.",
      "Maintain tree vigor through balanced fertilization.",
    ],
    fertilizers: [
      "Balanced NPK fertilizer",
      "Calcium and Magnesium supplements",
      "Organic manure",
    ],
  },
  "Garlic Rust": {
    precautions: [
      "Remove infected leaves promptly.",
      "Avoid overhead irrigation.",
      "Use resistant varieties if available.",
    ],
    fertilizers: [
      "Nitrogen fertilizer",
      "Phosphorus fertilizer",
      "Potassium fertilizer",
    ],
  },
};

// Mock disease detection based on image file name
function mockDetectDisease(imageFile) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const name = imageFile.name.toLowerCase();
      if (name.includes("banana")) resolve("Banana Freckle");
      else if (name.includes("rice")) resolve("Sheath Blight of Rice");
      else if (name.includes("coconut")) resolve("Coconut Disease");
      else if (name.includes("rubber")) resolve("Rubber Disease");
      else if (name.includes("garlic")) resolve("Garlic Rust");
      else resolve(null);
    }, 1500);
  });
}

// Styled components
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
  const [autoDetectDone, setAutoDetectDone] = useState(false); // Track if auto detect done

  const language = useLanguage(); // get current language

  const detectDisease = async (img) => {
    setError("");
    setDisease(null);
    if (!img) {
      setError(
        language === "malayalam"
          ? "ദയവായി ഒരു ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക."
          : "Please upload an image first."
      );
      return;
    }

    setLoading(true);

    try {
      const detected = await mockDetectDisease(img);

      // Simulate a loader delay (2 seconds)
      await new Promise((res) => setTimeout(res, 2000));

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

  const handleImageChange = async (e) => {
    setDisease(null);
    setError("");
    setAutoDetectDone(false); // Reset auto detect flag on new upload
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));

      // Automatically detect disease on first upload
      await detectDisease(file);
      setAutoDetectDone(true);
    }
  };

  const handleDetect = async () => {
    if (!image) {
      setError(
        language === "malayalam"
          ? "ദയവായി ഒരു ഇമേജ് അപ്‌ലോഡ് ചെയ്യുക."
          : "Please upload an image first."
      );
      return;
    }
    // Manual detection triggered by button click
    await detectDisease(image);
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
          {loading && (
            <Box mt={3} textAlign="center">
              <CircularProgress color="success" />
              <Typography variant="body2" mt={2}>
                {language === "malayalam"
                  ? "രോഗം പരിശോധിക്കുകയാണ്..."
                  : "Analyzing leaf image..."}
              </Typography>
            </Box>
          )}

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
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  {language === "malayalam"
                    ? "ശുപാർശ ചെയ്ത ഉണക്കവളങ്ങൾ:"
                    : "Suggested Fertilizers:"}
                </Typography>
                <Box component="ul" sx={{ pl: 3 }}>
                  {diseaseDatabase[disease].fertilizers.map((fert, idx) => (
                    <li key={idx}>
                      <Typography variant="body1">
                        {language === "malayalam"
                          ? translateFertilizer(fert)
                          : fert}
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
const translateFertilizer = (fert) => {
  const fertMap = {
    "Balanced NPK fertilizer (10-10-10)": "സമതുലിതമായ NPK ഉണക്കവളം (10-10-10)",
    "Potassium-rich fertilizer": "പൊട്ടാസ്യം സമൃദ്ധമായ ഉണക്കവളം",
    "Organic compost": "ഓർഗാനിക് കോമ്പോസ്റ്റ്",
    "Nitrogen fertilizer (Urea)": "നൈട്രജൻ ഉണക്കവളം (യൂറിയ)",
    "Phosphorus fertilizer (Single Super Phosphate)":
      "ഫോസ്ഫറസ് ഉണക്കവളം (സിംഗിൾ സൂപ്പർ ഫോസ്ഫേറ്റ്)",
    "Potassium fertilizer (Muriate of Potash)":
      "പൊട്ടാസ്യം ഉണക്കവളം (മ്യൂരിയേറ്റ് ഓഫ് പൊട്ടാഷ്)",
    "Coconut-specific NPK fertilizers": "തെങ്ങിനുള്ള പ്രത്യേക NPK ഉണക്കവളങ്ങൾ",
    "Magnesium sulfate": "മഗ്നീഷ്യം സൾഫേറ്റ്",
    "Organic mulch and compost": "ഓർഗാനിക് മൾച്ച് மற்றும் കോമ്പോസ്റ്റ്",
    "Balanced NPK fertilizer": "സമതുലിതമായ NPK ഉണക്കവളം",
    "Calcium and Magnesium supplements": "കാല്ഷ്യം, മഗ്നീഷ്യം സപ്ലിമെന്റുകൾ",
    "Organic manure": "ഓർഗാനിക് വളം",
    "Nitrogen fertilizer": "നൈട്രജൻ ഉണക്കവളം",
    "Phosphorus fertilizer": "ഫോസ്ഫറസ് ഉണക്കവളം",
    "Potassium fertilizer": "പൊട്ടാസ്യം ഉണക്കവളം",
  };
  return fertMap[fert] || fert;
};

// Malayalam translations for disease names
const translateDiseaseName = (name) => {
  const map = {
    "Banana Freckle": "ബനാന ഫ്രെകി (ഫൈലോസ്റ്റെറിക കാവെൻഡിഷി)",
    "Sheath Blight of Rice": "അരിപ്പടി ഷീത്ത് ബ്ലൈറ്റ്",
    "Coconut Disease": "തെങ്ങ് രോഗം",
    "Rubber Disease": "റബ്ബർ രോഗം",
    "Garlic Rust": "വെളുത്തുള്ളി റസ്റ്റ്",
  };
  return map[name] || name;
};

// Malayalam translations for precautions
const translateTip = (tip) => {
  const tipsMap = {
    "Remove infected banana leaves.": "സംക്രമിച്ച ബനാന ഇലകൾ നീക്കം ചെയ്യുക.",
    "Use disease-free planting material.": "രോഗമുക്തമായ വിത്ത് ഉപയോഗിക്കുക.",
    "Apply recommended fungicides.": "ശുപാർശ ചെയ്ത ഫംഗിസൈഡ് പ്രയോഗിക്കുക.",
    "Maintain proper water management.": "ശുദ്ധമായ ജലക്രമം പാലിക്കുക.",
    "Avoid dense planting to improve air circulation.":
      "മൂടിയുള്ള തോട്ടം ഒഴിവാക്കുക.",
    "Use fungicides as advised by experts.":
      "വൈദ്യരുടെ നിർദ്ദേശപ്രകാരം ഫംഗിസൈഡ് പ്രയോഗിക്കുക.",
    "Remove and destroy affected fronds.":
      "ബാധിതമായ ഇലകൾ നീക്കം ചെയ്ത് നശിപ്പിക്കുക.",
    "Apply copper-based fungicides regularly.":
      "കാപ്പർ അടങ്ങിയ ഫംഗിസൈഡ് സ്ഥിരമായി പ്രയോഗിക്കുക.",
    "Ensure good soil drainage.": "മണ്ണിന്റെ ജലമൊഴുക്ക് ഉറപ്പാക്കുക.",
    "Prune infected branches.": "ബാധിത ശാഖകൾ മുറിച്ചു കളയുക.",
    "Maintain tree vigor through balanced fertilization.":
      "സമതുലിതമായി പകൽവൃക്ഷം വളർത്തുക.",
    "Remove infected leaves promptly.": "സംക്രമിച്ച ഇലകൾ ഉടൻ നീക്കം ചെയ്യുക.",
    "Avoid overhead irrigation.": "മുകളിലൂടെ വെള്ളം വിതറുന്നത് ഒഴിവാക്കുക.",
    "Use resistant varieties if available.":
      "പ്രതിരോധ ശേഷിയുള്ള ഇനങ്ങൾ ഉപയോഗിക്കുക.",
  };
  return tipsMap[tip] || tip;
};
