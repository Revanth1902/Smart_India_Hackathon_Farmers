import React, { useState } from "react";
import {
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";

const CropAdvisoryPage = () => {
  const [crop, setCrop] = useState("");

  const dummyAdvisory = {
    Wheat: "Irrigate fields early morning. Use nitrogen fertilizer this week.",
    Rice: "Maintain standing water of 2-3 cm. Apply potash for better yield.",
    Cotton: "Monitor for pest infestation. Use organic pesticide if needed.",
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Crop Advisory
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Crop</InputLabel>
        <Select
          value={crop}
          label="Select Crop"
          onChange={(e) => setCrop(e.target.value)}
        >
          <MenuItem value="Wheat">Wheat</MenuItem>
          <MenuItem value="Rice">Rice</MenuItem>
          <MenuItem value="Cotton">Cotton</MenuItem>
        </Select>
      </FormControl>

      {crop && (
        <Card className="card" style={{ marginTop: "1rem" }}>
          <CardContent>
            <Typography variant="h6">{crop} Advisory</Typography>
            <Typography>{dummyAdvisory[crop]}</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropAdvisoryPage;
