import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import "../styles/Schemes.css";

const schemes = [
  {
    title: "PM-KISAN",
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
];

export default function Schemes() {
  return (
    <div className="app">
      <header className="header">
        <h2>KRISHI SAKHI</h2>
        <p>Government Schemes</p>
      </header>

      <div className="container">
        <div className="section-title">
          <span className="icon">👩‍🌾</span>
          Government Schemes for Farmers
        </div>
        <p className="subtitle">
          Latest government schemes and benefits available for farmers
        </p>

        {schemes.map((scheme, index) => (
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
        ))}
      </div>

      <footer className="footer">Made with ❤️</footer>
    </div>
  );
}
