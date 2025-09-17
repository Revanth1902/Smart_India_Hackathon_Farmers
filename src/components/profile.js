import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

// Dummy farmer profile data
let farmerData = {
  name: "Ravi Kumar",
  phone: "+91 98765 43210",
  location: "Thrissur, Kerala",
  landType: "Wetland",
  farmSize: "2.5 acres",
  crops: ["Rice", "Banana", "Coconut"],
  email: "ravi.kumar@example.com",
  profileImage: "/farmerprofile.jpg",
};

// Load user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  console.log("User loaded from localStorage:", user);

  // Overwrite name and location with user data
  farmerData = {
    ...farmerData,
    userId: user.id,
    userName: user.name,
    mobile: user.mobile,
    state: user.state,
    district: user.district,
    village: user.village,
  };
} else {
  console.warn("No user found in localStorage.");
}

// Dummy crop history data
const cropHistory = [
  {
    cropYear: "2024-2025",
    currentCrop: "Banana",
    previousCrops: ["Rice", "Turmeric"],
    fertilizersUsed: ["Urea", "Compost"],
  },
  {
    cropYear: "2023-2024",
    currentCrop: "Coconut",
    previousCrops: ["Banana", "Chili"],
    fertilizersUsed: ["NPK", "Vermicompost"],
  },
  {
    cropYear: "2022-2023",
    currentCrop: "Rice",
    previousCrops: ["Maize", "Green Gram"],
    fertilizersUsed: ["DAP", "Bio-fertilizers"],
  },
  {
    cropYear: "2021-2022",
    currentCrop: "Turmeric",
    previousCrops: ["Chili", "Groundnut"],
    fertilizersUsed: ["Phosphate", "Compost"],
  },
  {
    cropYear: "2020-2021",
    currentCrop: "Maize",
    previousCrops: ["Sunflower", "Rice"],
    fertilizersUsed: ["Urea", "Potash"],
  },
  {
    cropYear: "2019-2020",
    currentCrop: "Sugarcane",
    previousCrops: ["Maize", "Pulses"],
    fertilizersUsed: ["Organic Manure", "NPK"],
  },
];

export default function FarmerProfile() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 900,
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      {/* === Profile Card === */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          mb: 4,
        }}
      >
        <CardContent>
          {/* Header: Avatar and Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Avatar
              src={farmerData.profileImage}
              alt={farmerData.userName}
              sx={{ width: 96, height: 96, border: "3px solid #2f855a" }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {farmerData.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Farmer Profile
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{farmerData.mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{farmerData.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {farmerData.village}, {farmerData.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Land Type
              </Typography>
              <Typography variant="body1">{farmerData.landType}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Farm Size
              </Typography>
              <Typography variant="body1">{farmerData.farmSize}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Crops Grown
              </Typography>
              <Typography variant="body1">
                {farmerData.crops.join(", ")}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* === Crop History Card === */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crop History
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Crop Year</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Current Crop</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Previous Crops</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fertilizers Used</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cropHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.cropYear}</TableCell>
                    <TableCell>{item.currentCrop}</TableCell>
                    <TableCell>{item.previousCrops.join(", ")}</TableCell>
                    <TableCell>{item.fertilizersUsed.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
