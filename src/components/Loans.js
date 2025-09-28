import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AddIcon from "@mui/icons-material/Add";
const STORAGE_KEY = "farmer_loans";
const user = JSON.parse(localStorage.getItem("user"));

const initialLoans = [
  {
    loan_id: "FCL-00142",
    farmer_name: user?.name || "Unknown Farmer",
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
    next_payment_due_date: "2024-09-05",
  },
  {
    loan_id: "FEL-00305",
    farmer_name: user?.name || "Unknown Farmer",
    loan_purpose: "Equipment Purchase (Tractor)",
    loan_amount: 750000,
    loan_currency: "INR",
    loan_date_taken: "2023-11-25",
    interest_rate_pa: 8.5,
    loan_term_years: 5,
    repayment_frequency: "Monthly",
    emi_installment_amount: 15447.88,
    monthly_due_date: 28,
    total_payments_made: 10,
    total_amount_paid: 154478.8,
    principal_outstanding: 631908.5,
    next_payment_due_date: "2024-10-28",
  },
];

const COLORS = [
  "#4caf50",
  "#ff9800",
  "#2196f3",
  "#f44336",
  "#9c27b0",
  "#00bcd4",
];

const Loans = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  // Add "loan_date_taken" to newLoan state:
  const [newLoan, setNewLoan] = useState({
    farmer_name: user?.name || "",
    loan_purpose: "",
    loan_amount: "",
    interest_rate_pa: "",
    loan_date_taken: new Date().toISOString().split("T")[0], // default today
  });

  // Update handleAddLoan to use user-entered loan_date_taken (don't override)
  const handleAddLoan = () => {
    const newEntry = {
      ...newLoan,
      loan_id: `NEW-${Math.floor(Math.random() * 10000)}`,
      loan_currency: "INR",
      // Use user input loan_date_taken
      loan_date_taken: newLoan.loan_date_taken,
      loan_term_years: 2,
      repayment_frequency: "Monthly",
      emi_installment_amount: 10000,
      monthly_due_date: 15,
      total_payments_made: 0,
      total_amount_paid: 0,
      principal_outstanding: parseFloat(newLoan.loan_amount),
      next_payment_due_date: "2024-10-15",
      interest_rate_pa: parseFloat(newLoan.interest_rate_pa),
    };

    const updated = [...loans, newEntry];
    setLoans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewLoan({
      farmer_name: user?.name || "",
      loan_purpose: "",
      loan_amount: "",
      interest_rate_pa: "",
      loan_date_taken: new Date().toISOString().split("T")[0],
    });
    setOpen(false);
  };

  // Add delete handler:
  const handleDeleteLoan = (loan_id) => {
    const updated = loans.filter((loan) => loan.loan_id !== loan_id);
    setLoans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    const delay = Math.random() * 2000 + 3000;
    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLoans(JSON.parse(stored));
      } else {
        setLoans(initialLoans);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLoans));
      }
      setLoading(false);
    }, delay);
  }, []);

  // Helper: calculate total expected payment = principal + interest over term
  // Formula: Principal * (1 + interest_rate_pa * loan_term_years / 100)
  const calculateTotalExpected = (loan) => {
    return (
      loan.loan_amount *
      (1 + (loan.interest_rate_pa * loan.loan_term_years) / 100)
    );
  };

  // Calculate payment percentage done
  const calculatePaymentPercent = (loan) => {
    const totalExpected = calculateTotalExpected(loan);
    const percent = (loan.total_amount_paid / totalExpected) * 100;
    return Math.min(percent, 100); // max 100%
  };

  const chartData = Object.values(
    loans.reduce((acc, loan) => {
      acc[loan.loan_purpose] = acc[loan.loan_purpose] || {
        name: loan.loan_purpose,
        value: 0,
      };
      acc[loan.loan_purpose].value += parseFloat(loan.loan_amount);
      return acc;
    }, {})
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}
      >
        🌾 Farmer Loan Management Dashboard
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mb={3}
          >
            <Typography variant="h6">Total Loans: {loans.length}</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add New Loan
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item sx={{ width: 400 }}>
              <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Loan Overview Chart
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item sx={{ width: 400 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  maxHeight: 400,
                  overflowY: "auto",
                  width: "100%", // full width inside grid
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  All Loans
                </Typography>
                {loans.map((loan) => {
                  const totalExpected = calculateTotalExpected(loan);
                  const percentPaid = calculatePaymentPercent(loan);
                  return (
                    <Box
                      key={loan.loan_id}
                      sx={{
                        borderBottom: "1px solid #ccc",
                        mb: 2,
                        pb: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }}>
                        {loan.farmer_name} — ₹
                        {loan.loan_amount.toLocaleString()} ({loan.loan_purpose}
                        )
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Taken on: {loan.loan_date_taken}, Next Due:{" "}
                        {loan.next_payment_due_date}
                      </Typography>
                      <Typography variant="body2" mb={1}>
                        Interest Rate: {loan.interest_rate_pa} % p.a.
                      </Typography>
                      <Typography variant="body2" mb={1}>
                        Paid: ₹{loan.total_amount_paid.toLocaleString()} / ₹
                        {totalExpected.toLocaleString()} (
                        {percentPaid.toFixed(2)}%)
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={percentPaid}
                          size={50}
                          thickness={5}
                          color={percentPaid > 50 ? "success" : "primary"}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {percentPaid.toFixed(1)}% paid
                        </Typography>

                        {/* Delete button */}
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteLoan(loan.loan_id)}
                          sx={{ ml: "auto" }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Add Loan Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Farmer Loan</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Farmer Name"
            value={newLoan.farmer_name}
            onChange={(e) =>
              setNewLoan({ ...newLoan, farmer_name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            fullWidth
            label="Loan Purpose"
            value={newLoan.loan_purpose}
            onChange={(e) =>
              setNewLoan({ ...newLoan, loan_purpose: e.target.value })
            }
          />
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Loan Amount"
            value={newLoan.loan_amount}
            onChange={(e) =>
              setNewLoan({ ...newLoan, loan_amount: e.target.value })
            }
          />
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Interest Rate (% p.a.)"
            value={newLoan.interest_rate_pa}
            onChange={(e) =>
              setNewLoan({ ...newLoan, interest_rate_pa: e.target.value })
            }
          />
          <TextField
            margin="dense"
            fullWidth
            label="Loan Date Taken"
            type="date"
            value={newLoan.loan_date_taken}
            onChange={(e) =>
              setNewLoan({ ...newLoan, loan_date_taken: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddLoan}
            disabled={
              !newLoan.farmer_name ||
              !newLoan.loan_purpose ||
              !newLoan.loan_amount ||
              !newLoan.interest_rate_pa
            }
          >
            Add Loan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Loans;
