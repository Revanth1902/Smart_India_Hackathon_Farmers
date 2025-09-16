import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GrainIcon from "@mui/icons-material/Grain";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import SpaIcon from "@mui/icons-material/Spa";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const iconMap = {
  Rice: <GrainIcon />,
  Coconut: <EmojiNatureIcon />,
  Pepper: <LocalFloristIcon />,
  Cardamom: <SpaIcon />,
  Banana: <RestaurantIcon />,
  Tomato: <EmojiNatureIcon />, // Reusing emoji for Tomato
};

const productsToFetch = [
  { searchTerm: "coconut" },
  { searchTerm: "banana" },
  { searchTerm: "tomato" },
  { searchTerm: "pepper" },
  { searchTerm: "cardamom" },
];

function getRandomPrice(min = 20, max = 200) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function MarketPrices() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await Promise.all(
          productsToFetch.map(async ({ searchTerm }) => {
            const response = await fetch(
              `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&search_simple=1&action=process&json=1&page_size=1`
            );
            const data = await response.json();

            if (data.products && data.products.length > 0) {
              const product = data.products[0];

              return {
                name: product.product_name || searchTerm,
                type: product.categories || "Unknown category",
                price: getRandomPrice(30, 150),
                unit: "per kg",
                date: new Date().toLocaleDateString(),
                icon: iconMap[
                  searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
                ] || <GrainIcon />,
              };
            } else {
              return {
                name: searchTerm,
                type: "No data",
                price: getRandomPrice(30, 150),
                unit: "per kg",
                date: new Date().toLocaleDateString(),
                icon: <GrainIcon />,
              };
            }
          })
        );

        setMarketData(results);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Loading market data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

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
            Current Market Prices - Kerala (Demo)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dynamic data fetched from OpenFoodFacts (prices are random)
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 250 }}
                  >
                    {item.type}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Kerala (demo)
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
