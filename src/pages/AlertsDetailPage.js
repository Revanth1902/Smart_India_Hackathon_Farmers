import React from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Box,
  List,
  Divider,
} from "@mui/material";
// data/sampleData.js

export const initialLoans = [
  {
    loan_id: "FCL-00142",
    farmer_name: "Priya Sharma",
    loan_purpose: "Crop Production (Wheat)",
    loan_amount: 150000,
    loan_currency: "INR",
    loan_date_taken: "2024-06-10",
    interest_rate_pa: 4.0,
    loan_term_years: 1.5,
    repayment_frequency: "Monthly",
    emi_installment_amount: 8658.74,
    monthly_due_date: 5,
    total_payments_made: 3,
    total_amount_paid: 25976.22,
    principal_outstanding: 125830.4,
    next_payment_due_date: "2025-10-03",
  },
  {
    loan_id: "FEL-00305",
    farmer_name: "Rajeev Singh",
    loan_purpose: "Equipment Purchase (Tractor)",
    loan_amount: 750000,
    emi_installment_amount: 15447.88,
    next_payment_due_date: "2025-10-07",
    total_amount_paid: 154478.8,
    total_payments_made: 10,
    principal_outstanding: 631908.5,
    loan_currency: "INR",
    loan_date_taken: "2023-11-25",
    interest_rate_pa: 8.5,
    loan_term_years: 5,
    repayment_frequency: "Monthly",
    monthly_due_date: 28,
  },
  {
    loan_id: "FCL-00199",
    farmer_name: "Anita Kumar",
    loan_purpose: "Dairy Expansion",
    loan_amount: 50000,
    emi_installment_amount: 2123.67,
    next_payment_due_date: "2025-10-10",
    total_amount_paid: 4247.34,
    total_payments_made: 2,
    principal_outstanding: 45752.66,
    loan_currency: "INR",
    loan_date_taken: "2025-06-20",
    interest_rate_pa: 6.5,
    loan_term_years: 2,
    repayment_frequency: "Monthly",
    monthly_due_date: 15,
  },
  {
    loan_id: "FCL-00200",
    farmer_name: "Ravi Menon",
    loan_purpose: "Drip Irrigation Setup",
    loan_amount: 90000,
    emi_installment_amount: 3125.25,
    next_payment_due_date: "2025-10-06",
    total_amount_paid: 12501.0,
    total_payments_made: 4,
    principal_outstanding: 77500.0,
    loan_currency: "INR",
    loan_date_taken: "2024-12-01",
    interest_rate_pa: 5.0,
    loan_term_years: 2,
    repayment_frequency: "Monthly",
    monthly_due_date: 5,
  },
];

export const pestEvents = [
  {
    level: "warning",
    messages: {
      english: "Aphid activity reported in nearby farms.",
      malayalam: "അടുത്ത ഫാമുകളിൽ ആഫിഡ് പ്രവണത കണ്ടെത്തിയിട്ടുണ്ട്.",
    },
  },
  {
    level: "info",
    messages: {
      english: "Low pest pressure today — no action needed.",
      malayalam: "ഇന്ന് കീടസംക്രമം കുറവാണ് — നടപടിയില്ല.",
    },
  },
  {
    level: "critical",
    messages: {
      english: "Fungal spores detected — apply fungicide if needed.",
      malayalam: "ഫംഗൽ സ്പോർസ് കണ്ടെത്തിയിട്ടുണ്ട് — ഫംഗിസൈഡ് ഉപയോഗിക്കുക.",
    },
  },
  {
    level: "warning",
    messages: {
      english: "Leaf miner risk in leafy vegetables this week.",
      malayalam: "ഈ ആഴ്ച ഇലക്കറികളിൽ ലീഫ് മൈനർ അപകടസാധ്യതയുണ്ട്.",
    },
  },
  {
    level: "warning",
    messages: {
      english: "Red spider mite outbreak in tomato farms nearby.",
      malayalam: "തക്കാളി ഫാമുകളിൽ ചുവപ്പൻ കുറുനൂളൻ പുഴു ബാധ.",
    },
  },
];

const AlertsDetailPage = () => {
  const location = useLocation();
  const path = location.pathname.split("/").pop(); // pests or loans

  const isPest = path === "pests";
  const data = isPest ? pestEvents : initialLoans;

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {isPest ? "Pest Alerts" : "Loan Payment Details"}
      </Typography>

      <List>
        {data.map((item, idx) => (
          <Card key={idx} sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              {isPest ? (
                <>
                  <Typography variant="h6" color="text.secondary">
                    Level: {item.level}
                  </Typography>
                  <Typography>{item.messages["english"]}</Typography>
                </>
              ) : (
                <>
                  <Typography variant="h6" fontWeight="bold">
                    {item.loan_purpose}
                  </Typography>
                  <Typography>Farmer: {item.farmer_name}</Typography>
                  <Typography>Amount: ₹{item.loan_amount}</Typography>
                  <Typography>
                    Next Due: {item.next_payment_due_date}
                  </Typography>
                  <Typography>
                    EMI: ₹{item.emi_installment_amount.toFixed(2)}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default AlertsDetailPage;
