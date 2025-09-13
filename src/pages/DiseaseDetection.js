import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

const DiseaseDetectionPage = () => {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const handleDetection = () => {
    // dummy detection
    if (symptoms.toLowerCase().includes("yellow")) {
      setResult("Possible Leaf Yellowing - Nitrogen Deficiency.");
    } else if (symptoms.toLowerCase().includes("spots")) {
      setResult("Possible Leaf Spot Disease. Apply fungicide.");
    } else {
      setResult("No major disease detected. Monitor crop regularly.");
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Disease Detection
      </Typography>

      <TextField
        fullWidth
        label="Describe Symptoms"
        margin="normal"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <Button
        variant="contained"
        style={{ background: "var(--primary-green)", marginTop: "1rem" }}
        fullWidth
        onClick={handleDetection}
      >
        Detect Disease
      </Button>

      {result && (
        <Card className="card" style={{ marginTop: "1rem" }}>
          <CardContent>
            <Typography variant="h6">Detection Result</Typography>
            <Typography>{result}</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiseaseDetectionPage;
