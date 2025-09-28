import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// LocalStorage key
const STORAGE_KEY = "kerala_farm_markets";

// Dummy data for Kerala farm markets
const dummyMarkets = [
  {
    id: 1,
    place: "Muvattupuzha",
    marketName: "Muvattupuzha Farmers Market",
    location: "Near KSRTC Bus Stand",
    timings: "7 AM - 1 PM",
    distance: "5 km",
  },
  {
    id: 2,
    place: "Alappuzha",
    marketName: "Alappuzha Green Bazaar",
    location: "Central Town Market",
    timings: "6 AM - 2 PM",
    distance: "8 km",
  },
  {
    id: 3,
    place: "Kottayam",
    marketName: "Kottayam Agro Market",
    location: "Near Railway Station",
    timings: "6:30 AM - 1 PM",
    distance: "6.5 km",
  },
  {
    id: 4,
    place: "Thrissur",
    marketName: "Thrissur Organic Market",
    location: "Swaraj Round",
    timings: "7 AM - 12 PM",
    distance: "4.2 km",
  },
  {
    id: 5,
    place: "Wayanad",
    marketName: "Kalpetta Weekly Market",
    location: "Main Junction",
    timings: "Friday, 8 AM - 3 PM",
    distance: "10 km",
  },
  {
    id: 6,
    place: "Kasaragod",
    marketName: "Kasaragod Farm Hub",
    location: "Old Bus Stand",
    timings: "7 AM - 2 PM",
    distance: "9.5 km",
  },
  {
    id: 7,
    place: "Palakkad",
    marketName: "Palakkad Farmers’ Collective",
    location: "Municipal Market",
    timings: "6 AM - 1:30 PM",
    distance: "6 km",
  },
  {
    id: 8,
    place: "Kozhikode",
    marketName: "Kozhikode Eco Market",
    location: "Beach Road",
    timings: "7 AM - 12 PM",
    distance: "7.8 km",
  },
  {
    id: 9,
    place: "Idukki",
    marketName: "Idukki Mountain Market",
    location: "Near Panchayat Office",
    timings: "Tuesday & Friday, 8 AM - 2 PM",
    distance: "11 km",
  },
  {
    id: 10,
    place: "Malappuram",
    marketName: "Malappuram Haat",
    location: "Old Market Road",
    timings: "6:30 AM - 1 PM",
    distance: "5.6 km",
  },
];

const MarketList = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load from localStorage or fallback to dummy data
  useEffect(() => {
    const delay = Math.floor(Math.random() * 2000) + 3000; // Random delay between 3000ms (3s) and 5000ms (5s)

    const stored = localStorage.getItem(STORAGE_KEY);

    setTimeout(() => {
      if (stored) {
        setMarkets(JSON.parse(stored));
      } else {
        setMarkets(dummyMarkets);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyMarkets));
      }
      setLoading(false);
    }, delay);
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#33691e", fontWeight: "bold" }}
      >
        🏬 List of Markets Near to Your Farm Location
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            alignSelf: "center",
            justifySelf: "center",
          }}
        >
          {markets.map((market) => (
            <Grid item xs={12} sm={6} key={market.id}>
              <Card
                sx={{
                  backgroundColor: "#f1f8e9",
                  border: "1px solid #c5e1a5",
                  "&:hover": {
                    boxShadow: 3,
                    backgroundColor: "#e6f4ea",
                  },
                  width: "100%",
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {market.place}
                  </Typography>
                  <Typography>
                    <strong>Market:</strong> {market.marketName}
                  </Typography>
                  <Typography>
                    <strong>Location:</strong> {market.location}
                  </Typography>
                  <Typography>
                    <strong>Timings:</strong> {market.timings}
                  </Typography>
                  <Typography>
                    <strong>Distance:</strong> {market.distance}
                  </Typography>

                  <Box mt={1} display="flex" justifyContent="flex-end">
                    <IconButton
                      onClick={() => navigate("/dashboard/marketprice")}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MarketList;
