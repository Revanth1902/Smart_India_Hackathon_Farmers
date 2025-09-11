import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import FarmIcon from "@mui/icons-material/Grass";
import "../styles/AuthForm.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/AuthForm.css";

export default function AuthForm() {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const otpInputsRef = useRef([]);

  const API_BASE = "https://farmer-backend-dqit.onrender.com/api/auth";

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setOtpSent(false);
    setMobile("");
    setName("");
    clearOtpInputs();
  };

  const clearOtpInputs = () => {
    otpInputsRef.current.forEach((input) => {
      if (input) input.value = "";
    });
  };

  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value && index < 3) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!mobile.match(/^\d{10}$/)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (tab === 1 && !name.trim()) {
      toast.error("Name is required for registration.");
      return;
    }

    try {
      const payload = {
        mobile,
        ...(tab === 1 ? { name } : {}),
      };

      const response = await axios.post(`${API_BASE}/register`, payload);
      toast.success("OTP sent successfully!");
      setOtpSent(true);
      clearOtpInputs();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to send OTP. Try again."
      );
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpInputsRef.current.map((input) => input.value).join("");

    if (otp.length !== 4) {
      toast.error("Please enter the 4-digit OTP.");
      return;
    }

    try {
      const payload = { mobile, otp };
      const response = await axios.post(`${API_BASE}/verify`, payload);

      const token = response?.data?.token;
      toast.success(`${tab === 0 ? "Login" : "Registration"} successful!`);

      // Optional: Save token to localStorage
      localStorage.setItem("token", token);

      // Reset
      setOtpSent(false);
      setMobile("");
      setName("");
      clearOtpInputs();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <Paper elevation={3} className="auth-paper" sx={{ borderRadius: "16px" }}>
        <Box textAlign="center" mb={2}>
          <FarmIcon fontSize="large" color="success" />
          <Typography variant="h4" component="h1" className="auth-title">
            Farmer Portal
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="success"
          textColor="success"
          centered
        >
          <Tab
            label="Login"
            sx={{
              fontWeight: tab === 0 ? "bold" : "normal",
              color: tab === 0 ? "green" : "inherit",
              backgroundColor:
                tab === 0 ? "rgba(76, 175, 80, 0.1)" : "transparent",
              borderRadius: "16px",
              transition: "all 0.3s ease",
            }}
          />
          <Tab
            label="Register"
            sx={{
              fontWeight: tab === 1 ? "bold" : "normal",
              color: tab === 1 ? "green" : "inherit",
              backgroundColor:
                tab === 1 ? "rgba(76, 175, 80, 0.1)" : "transparent",
              borderRadius: "16px",
              transition: "all 0.3s ease",
            }}
          />
        </Tabs>

        {!otpSent ? (
          <form className="form-container" onSubmit={sendOtp}>
            {tab === 1 && (
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}

            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
              inputProps={{ maxLength: 10 }}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form className="otp-Form" onSubmit={verifyOtp}>
            <span className="mainHeading">Enter OTP</span>
            <p className="otpSubheading">
              We have sent a verification code to your mobile number
            </p>
            <div className="inputContainer">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  maxLength={1}
                  type="text"
                  className="otp-input"
                  ref={(el) => (otpInputsRef.current[index] = el)}
                  onChange={(e) => handleOtpInput(e, index)}
                  required
                />
              ))}
            </div>
            <button className="verifyButton" type="submit">
              Verify
            </button>
            <button
              type="button"
              className="exitBtn"
              onClick={() => {
                setOtpSent(false);
                clearOtpInputs();
              }}
            >
              ×
            </button>
            <p className="resendNote">
              Didn't receive the code?{" "}
              <button type="button" className="resendBtn" onClick={sendOtp}>
                Resend Code
              </button>
            </p>
          </form>
        )}
      </Paper>
    </div>
  );
}
