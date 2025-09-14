import React from "react";
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GrainIcon from "@mui/icons-material/Grain";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const marketData = [
  {
    name: "Rice",
    type: "Basmati - Kochi Mandi",
    price: 45,
    unit: "per kg",
    date: "9/14/2025",
    icon: <GrainIcon />,
  },
  {
    name: "Coconut",
    type: "Green - Thrissur Market",
    price: 25,
    unit: "per kg",
    date: "9/14/2025",
    icon: <EmojiNatureIcon />,
  },
  {
    name: "Pepper",
    type: "Black - Cochin Spice Market",
    price: 800,
    unit: "per kg",
    date: "9/14/2025",
    icon: <LocalFloristIcon />,
  },
  {
    name: "Cardamom",
    type: "Green - Kumily Market",
    price: 1200,
    unit: "per kg",
    date: "9/14/2025",
    icon: <SpaIcon />,
  },
  {
    name: "Banana",
    type: "Nendran - Palakkad Market",
    price: 35,
    unit: "per kg",
    date: "9/14/2025",
    icon: <RestaurantIcon />,
  },
];

export default function MarketPrices() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff7f2", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          color: "#e65100",
        }}
      >
        <TrendingUpIcon fontSize="large" />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Current Market Prices - Kerala
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest prices from local mandis and markets
          </Typography>
        </Box>
      </Box>

      {/* Market Items */}
      <Box display="flex" flexDirection="column" gap={2}>
        {marketData.map((item, idx) => (
          <Card
            key={idx}
            sx={{
              borderRadius: 2,
              bgcolor: "#fff9f0",
              boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Left Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ color: "#e65100" }}>{item.icon}</Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.type}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Kerala
                  </Typography>
                </Box>
              </Box>

              {/* Right Info */}
              <Box textAlign="right">
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#e65100" }}
                >
                  ₹{item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.unit}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {item.date}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
