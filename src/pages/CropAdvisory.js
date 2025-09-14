import React, { useState } from "react";
import {
  CssBaseline,
  Container,
  Grid,
  Paper,
  Button,
  Card,
  CardMedia,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import useLanguage from "../hooks/useLanguage";
import { translations } from "../utils/translations";

const cropImages = {
  Rice: "/rice.jpg",
  Maize: "/maize.jpeg",
  Wheat: "/wheat.jpg",
  Barley: "/barley.webp",
  Millets: "/millets.jpg",
  Pulses: "/pulses.jpg",
};

const seasons = ["Summer", "Winter", "Rainy", "Spring"];
const farmTypes = ["Irrigated", "Dryland"];

const tipsData = {
  Rice: [
    {
      english: "Needs abundant water & flooded fields.",
      malayalam: "പ്രചുരമായ വെള്ളവും പ്രളയ മൈതാനങ്ങളും ആവശ്യമാണ്.",
    },
    {
      english: "Plant at start of heavy rain season.",
      malayalam: "കനത്ത മഴക്കാലം തുടങ്ങിയപ്പോൾ നടുക.",
    },
    {
      english: "Use good seed, spacing approx 20×20 cm.",
      malayalam: "നല്ല വിത്ത് ഉപയോഗിക്കുക, ഇടവേള ഏകദേശം 20×20 സെമി.",
    },
  ],
  Maize: [
    {
      english: "Works well in dryland, needs well‑drained soil.",
      malayalam:
        "വരണ്ട സ്ഥലത്തും നന്നായി വളരുന്നു, വെള്ളം അളവ് കൃത്യമായ മണ്ണ് ആവശ്യമാണ്.",
    },
    {
      english: "Protect from heavy monsoon damage.",
      malayalam: "കനത്ത മഴയിൽ നിന്നു സംരക്ഷിക്കുക.",
    },
    {
      english: "Harvest early if rain increases.",
      malayalam: "മഴ വർദ്ധിച്ചാൽ നേരത്തെ വിളവെടുപ്പ് ചെയ്യുക.",
    },
  ],
  Wheat: [
    {
      english: "Cool and dry season is best.",
      malayalam: "തണുത്ത, വരണ്ട കാലാവസ്ഥ ഏറ്റവും നല്ലത്.",
    },
    {
      english: "Good fertilizer helps if soil is fertile.",
      malayalam: "മണ്ണ് സമൃദ്ധമാണെങ്കിൽ മികച്ച എരിവിൽ സഹായിക്കും.",
    },
    {
      english: "Harvest when stalks golden.",
      malayalam: "കാങ്ക് പൊൻ നിറമാകുമ്പോൾ വിളവെടുക്കുക.",
    },
  ],
  Barley: [
    {
      english: "Good choice for low water conditions.",
      malayalam: "വെള്ളം കുറവായ സാഹചര്യത്തിന് നല്ലത്.",
    },
    {
      english: "Plant early in Rabi; avoid late rains.",
      malayalam: "ശീതകാലം ആരംഭത്തിൽ നടുക; വൈകിയ മഴ ഒഴിവാക്കുക.",
    },
    {
      english: "Select disease‑resistant seeds.",
      malayalam: "രോഗപ്രതിരോധക വിത്തുകൾ തിരഞ്ഞെടുക്കുക.",
    },
  ],
  Pulses: [
    {
      english: "Fixes nitrogen in soil → good for soil health.",
      malayalam:
        "മണ്ണിൽ നൈറ്റ്രജൻ ചേർക്കുന്നു → മണ്ണിന്റെ ആരോഗ്യത്തിന് നല്ലത്.",
    },
    {
      english: "Lower water requirement.",
      malayalam: "വെള്ളം കുറഞ്ഞ അളവിൽ ആവശ്യമാണ്.",
    },
    {
      english: "Harvest when pods are dry and brown.",
      malayalam: "പയർ പൂക്കൾ ഉണങ്ങിയ ശേഷം വിളവെടുപ്പ് ചെയ്യുക.",
    },
  ],
  Millets: [
    {
      english: "Drought‑tolerant.",
      malayalam: "പണി സഹിക്കാനാകും.",
    },
    {
      english: "Can grow in poor soil.",
      malayalam: "പാവപ്പെട്ട മണ്ണിലും വളരും.",
    },
    {
      english: "Short growing time; good fallback crop.",
      malayalam: "വളരാൻ കുറച്ച് സമയം എടുക്കുന്നു; ബാക്കപ്പ് വിളയായി നല്ലത്.",
    },
  ],
};

export default function App() {
  const language = useLanguage();

  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [farmType, setFarmType] = useState("");
  const [error, setError] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  const t = (key) => translations[key][language]; // helper to get translation by key

  const handleAdvice = () => {
    if (!location || !season || !farmType) {
      setError(t("errorFillAllFields"));
      setRecommendation(null);
      return;
    }
    setError("");

    let crop = "Millets"; // default

    if (season === "Rainy") {
      crop = farmType === "Irrigated" ? "Rice" : "Maize";
    } else if (season === "Winter") {
      crop = farmType === "Irrigated" ? "Wheat" : "Barley";
    } else if (season === "Spring") {
      crop = "Pulses";
    } else if (season === "Summer") {
      crop = farmType === "Irrigated" ? "Rice" : "Millets";
    }

    setRecommendation({ crop, location, season, farmType });
  };

  return (
    <>
      <CssBaseline />

      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {t("adviceTitle")}
          </Typography>

          <Container maxWidth="md" sx={{ mt: 3 }}>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              {/* Location input */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label={t("locationLabel")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              {/* Season dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label={t("seasonLabel")}
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ minWidth: 250 }}
                >
                  {seasons.map((s) => (
                    <MenuItem key={s} value={s}>
                      {language === "malayalam"
                        ? {
                            Summer: "വൈകുന്നേരം",
                            Winter: "ചൂട്",
                            Rainy: "മഴക്കാലം",
                            Spring: "വസന്തം",
                          }[s] || s
                        : s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Farm Type dropdown */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  label={t("farmTypeLabel")}
                  value={farmType}
                  onChange={(e) => setFarmType(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ minWidth: 250 }}
                >
                  {farmTypes.map((f) => (
                    <MenuItem key={f} value={f}>
                      {language === "malayalam"
                        ? {
                            Irrigated: "ജലസേചിതം",
                            Dryland: "വറ്റി നിൽക്കുന്ന മണ്ണ്",
                          }[f] || f
                        : f}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Container>

          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#388e3c",
                "&:hover": { backgroundColor: "#2e7d32" },
                px: 4,
                py: 1.5,
              }}
              onClick={handleAdvice}
            >
              {t("buttonGetAdvice")}
            </Button>
          </Box>

          {error && (
            <Typography color="error" align="center" sx={{ mt: 3 }}>
              {error}
            </Typography>
          )}

          {recommendation && (
            <Card
              sx={{
                mt: 5,
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={cropImages[recommendation.crop] || cropImages["Millets"]}
                alt={recommendation.crop}
              />
              <CardContent sx={{ backgroundColor: "#f0f4c3" }}>
                <Typography variant="h6" align="center">
                  {language === "malayalam"
                    ? "ഇത്തവണയുള്ള മികച്ച വിള"
                    : "Best Crop for"}{" "}
                  <strong>{recommendation.season}</strong>{" "}
                  {language === "malayalam" ? "ൽ" : "in"}{" "}
                  <strong>{recommendation.location}</strong> (
                  {language === "malayalam" ? "നിലത്ത്" : "land"}:{" "}
                  {language === "malayalam"
                    ? {
                        Irrigated: "ജലസേചിതം",
                        Dryland: "വറ്റി നിൽക്കുന്ന മണ്ണ്",
                      }[recommendation.farmType] || recommendation.farmType
                    : recommendation.farmType}
                  )
                </Typography>
                <Typography
                  variant="h3"
                  align="center"
                  color="primary"
                  sx={{ mt: 2, mb: 2, fontWeight: "bold" }}
                >
                  {recommendation.crop}
                </Typography>

                <Typography variant="subtitle1">
                  {t("someUsefulTips")}
                </Typography>
                <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                  {tipsData[recommendation.crop].map((tip, idx) => (
                    <li key={idx}>{tip[language]}</li>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
    </>
  );
}
