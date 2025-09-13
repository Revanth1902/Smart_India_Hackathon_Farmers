import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

const FertilizerRecommendation = () => {
  const [soilPh, setSoilPh] = useState("");
  const [crop, setCrop] = useState("");
  const [recommendation, setRecommendation] = useState(null);

  const handleSubmit = () => {
    // dummy logic
    if (crop.toLowerCase() === "wheat") {
      setRecommendation("Apply Urea 50kg/acre and DAP 20kg/acre.");
    } else if (crop.toLowerCase() === "rice") {
      setRecommendation("Apply Potash 30kg/acre and NPK 10kg/acre.");
    } else {
      setRecommendation("Use organic compost and balanced NPK fertilizers.");
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Fertilizer Recommendation
      </Typography>

      <TextField
        fullWidth
        label="Crop Name"
        margin="normal"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
      />
      <TextField
        fullWidth
        label="Soil pH"
        margin="normal"
        value={soilPh}
        onChange={(e) => setSoilPh(e.target.value)}
      />

      <Button
        variant="contained"
        style={{ background: "var(--primary-green)", marginTop: "1rem" }}
        fullWidth
        onClick={handleSubmit}
      >
        Get Recommendation
      </Button>

      {recommendation && (
        <Card className="card" style={{ marginTop: "1rem" }}>
          <CardContent>
            <Typography variant="h6">Recommendation</Typography>
            <Typography>{recommendation}</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FertilizerRecommendation;
