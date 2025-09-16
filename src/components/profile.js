import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";

const farmerData = {
  name: "Ravi Kumar",
  phone: "+91 98765 43210",
  location: "Thrissur, Kerala",
  landType: "Wetland",
  farmSize: "2.5 acres",
  crops: ["Rice", "Banana", "Coconut"],
  email: "ravi.kumar@example.com",
  profileImage: "/farmerprofile.jpg", // placeholder image
};

export default function FarmerProfile() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 600,
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)", // for Safari support
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1),
      inset 0 0 8px 4px rgba(255, 255, 255, 0.4)
    `,
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
              alt={farmerData.name}
              sx={{ width: 96, height: 96, border: "3px solid #2f855a" }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {farmerData.name}
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
              <Typography variant="body1">{farmerData.phone}</Typography>
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
              <Typography variant="body1">{farmerData.location}</Typography>
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
    </Box>
  );
}
