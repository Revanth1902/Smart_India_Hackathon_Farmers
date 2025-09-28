import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import "../styles/Schemes.css";

// Extended schemes with farmerType
const schemes = [
  {
    title: "Organic Kerala Mission",
    category: "Organic",
    farmerType: "Small Scale",
    status: "Active",
    description:
      "Promotes organic farming across Kerala with subsidies and training.",
    eligibility: ["Farmers practicing or transitioning to organic methods"],
    benefits: [
      "Subsidy on organic inputs",
      "Training sessions and workshops",
      "Certification assistance",
    ],
    howToApply:
      "Contact local Agricultural Officer or register at krishi.kerala.gov.in",
    contact: "Department of Agriculture Development: 0471-2303990",
  },
  {
    title: "PM-KISAN",
    category: "Income Support",
    farmerType: "Small Scale",
    status: "Active",
    description: "Direct income support to farmers",
    eligibility: [
      "Small and marginal farmers",
      "Land ownership certificate required",
    ],
    benefits: ["₹6000 per year in 3 installments", "Direct bank transfer"],
    howToApply: "Apply online at pmkisan.gov.in or visit nearest CSC",
    contact: "Toll-free: 155261",
  },
  {
    title: "Soil Health Card Scheme",
    category: "Soil",
    farmerType: "All",
    status: "Active",
    description: "Free soil testing and health card for farmers",
    eligibility: ["All farmers", "Land ownership or tenancy proof required"],
    benefits: [
      "Free soil testing",
      "Customized fertilizer recommendations",
      "Improved crop yield",
    ],
    howToApply: "Visit nearest Krishi Vigyan Kendra or Agricultural Office",
    contact: "Contact local Agricultural Officer",
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana",
    category: "Insurance",
    farmerType: "Large Scale",
    status: "Active",
    description: "Crop insurance scheme for farmers",
    eligibility: ["All farmers", "Crop cultivation proof required"],
    benefits: [
      "Insurance coverage for crop losses",
      "Premium subsidy",
      "Quick claim settlement",
    ],
    howToApply: "Apply through banks, insurance companies, or online portal",
    contact: "Helpline: 14447",
  },
  {
    title: "Karshaka Raksha Scheme",
    category: "Insurance",
    farmerType: "Small Scale",
    status: "Active",
    description:
      "State-sponsored life and accident insurance for registered farmers in Kerala.",
    eligibility: ["Registered Kerala farmers", "Aged 18–60 years"],
    benefits: [
      "₹2 lakh life insurance",
      "₹1 lakh accident coverage",
      "Premium paid by Kerala government",
    ],
    howToApply: "Register at Krishi Bhavan or through the Karshaka app",
    contact: "Helpline: 1800-425-1661",
  },
  {
    title: "Pokkali Paddy Promotion Scheme",
    category: "Crop Support",
    farmerType: "Large Scale",
    status: "Active",
    description:
      "Special scheme for farmers cultivating Pokkali rice in coastal Kerala areas.",
    eligibility: [
      "Farmers in Ernakulam, Alappuzha, and nearby coastal regions",
      "Pokkali variety cultivators",
    ],
    benefits: [
      "Financial support per acre",
      "Marketing support for Pokkali rice",
      "Assistance for mechanization",
    ],
    howToApply: "Apply through local Krishi Bhavan",
    contact: "District Agricultural Office: 0484-2422266",
  },
  // ✅ More dummy schemes
  {
    title: "Agri-Tech Subsidy Program",
    category: "Technology",
    farmerType: "Large Scale",
    status: "Active",
    description:
      "Provides financial assistance for large-scale mechanization and precision agriculture tools.",
    eligibility: ["Farmers owning more than 10 acres"],
    benefits: ["Machinery subsidies", "Training in modern agri-tools"],
    howToApply: "Register online via agri-tech portal",
    contact: "Helpline: 1800-111-111",
  },
  {
    title: "Backyard Farming Support",
    category: "Organic",
    farmerType: "Small Scale",
    status: "Active",
    description: "Encourages urban and backyard farming in Kerala.",
    eligibility: ["Households with less than 1 acre"],
    benefits: ["Seed kits", "Compost units", "Training on vertical farming"],
    howToApply: "Apply through local panchayat office",
    contact: "Local Horticulture Department",
  },
];

const categories = [
  "All",
  "Organic",
  "Income Support",
  "Soil",
  "Insurance",
  "Crop Support",
  "Technology",
];

const farmerTypes = ["All", "Small Scale", "Large Scale"];

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFarmerType, setSelectedFarmerType] = useState("All");

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || scheme.category === selectedCategory;

    const matchesFarmerType =
      selectedFarmerType === "All" ||
      scheme.farmerType === selectedFarmerType ||
      scheme.farmerType === "All";

    return matchesSearch && matchesCategory && matchesFarmerType;
  });

  return (
    <div className="apping">
      <div className="container">
        <div className="section-title">
          <span className="icon">👩‍🌾</span>
          Government Schemes for Farmers
        </div>
        <p className="subtitle">
          Latest government schemes and benefits available for farmers
        </p>

        {/* 🔍 Filter Bar */}
        <div className="filter-bar">
          <TextField
            label="Search Schemes"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginRight: 2, width: "250px" }}
          />

          <FormControl sx={{ minWidth: 180, marginRight: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <MenuItem key={i} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Farmer Type</InputLabel>
            <Select
              label="Farmer Type"
              value={selectedFarmerType}
              onChange={(e) => setSelectedFarmerType(e.target.value)}
            >
              {farmerTypes.map((type, i) => (
                <MenuItem key={i} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* 📄 Schemes List */}
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme, index) => (
            <Card key={index} className="scheme-card">
              <CardContent>
                <div className="card-header">
                  <Typography variant="h6" className="title">
                    {scheme.title}
                  </Typography>
                  <span className="status">{scheme.status}</span>
                </div>

                <Typography className="description">
                  {scheme.description}
                </Typography>

                <div className="info">
                  <div>
                    <h4>Eligibility:</h4>
                    <ul>
                      {scheme.eligibility.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Benefits:</h4>
                    <ul>
                      {scheme.benefits.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="apply">
                  <h4>How to Apply:</h4>
                  <p>{scheme.howToApply}</p>
                  <Button className="contact-btn">{scheme.contact}</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography sx={{ mt: 4 }} color="text.secondary">
            No schemes match your filters.
          </Typography>
        )}
      </div>
    </div>
  );
}
