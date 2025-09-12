import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FarmIcon from "@mui/icons-material/Grass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// JSON of state & district
import locationData from "../India-State-District.json";

export default function AuthForm() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const otpInputsRef = useRef([]);

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const API_BASE = "https://farmer-backend-dqit.onrender.com/api/auth";

  useEffect(() => {
    const uniqueStates = locationData.map((item) => item.name).sort();
    setStatesList(uniqueStates);
  }, []);

  const handleStateChange = (event) => {
    const stateName = event.target.value;
    setSelectedState(stateName);
    setSelectedDistrict("");
    setSelectedVillage("");

    const stateObj = locationData.find((item) => item.name === stateName);
    setDistrictsList(stateObj ? stateObj.districts.sort() : []);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedVillage("");
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setOtpSent(false);
    setMobile("");
    setName("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setDistrictsList([]);
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
    if (value && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!mobile.match(/^\d{10}$/)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (tab === 1) {
      if (!name.trim()) {
        toast.error("Name is required for registration.");
        return;
      }
      if (!selectedState || !selectedDistrict || !selectedVillage) {
        toast.error("Please select State, District & Village.");
        return;
      }
    }

    try {
      const payload = {
        mobile,
        ...(tab === 1
          ? {
              name,
              state: selectedState,
              district: selectedDistrict,
              village: selectedVillage,
            }
          : {}),
      };

      const response = await axios.post(
        `${API_BASE}/${tab === 1 ? "register" : "login"}`,
        payload
      );

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

    if (otp.length !== 6) {
      toast.error("Please enter the 4-digit OTP.");
      return;
    }

    try {
      const payload = { mobile, otp };
      const response = await axios.post(`${API_BASE}/verify`, payload);

      const token = response?.data?.token;
      toast.success(`${tab === 0 ? "Login" : "Registration"} successful!`);

      Cookies.set("authToken", token, { expires: 7 });

      navigate("/home");

      // Reset
      setOtpSent(false);
      setMobile("");
      setName("");
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedVillage("");
      setDistrictsList([]);
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
      <Paper
        elevation={3}
        className="auth-paper"
        sx={{ borderRadius: "16px", padding: "2rem" }}
      >
        <Box textAlign="center" mb={2}>
          <FarmIcon fontSize="large" color="success" />
          <Typography variant="h4" component="h1">
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
              <>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="state-select-label">State</InputLabel>
                  <Select
                    labelId="state-select-label"
                    value={selectedState}
                    label="State"
                    onChange={handleStateChange}
                  >
                    {statesList.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  margin="normal"
                  required
                  disabled={!selectedState}
                >
                  <InputLabel id="district-select-label">District</InputLabel>
                  <Select
                    labelId="district-select-label"
                    value={selectedDistrict}
                    label="District"
                    onChange={handleDistrictChange}
                  >
                    {districtsList.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Village"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  required
                  disabled={!selectedDistrict}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                  }}
                />
              </>
            )}

            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 10 }}
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
          <form className="form-container" onSubmit={verifyOtp}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Enter the 6-digit OTP sent to your mobile
            </Typography>

            <Box display="flex" justifyContent="center" gap={2}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <TextField
                  key={i}
                  inputRef={(el) => (otpInputsRef.current[i] = el)}
                  onChange={(e) => handleOtpInput(e, i)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "20px" },
                  }}
                  sx={{ width: "60px" }}
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
            >
              Verify OTP
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => {
                setOtpSent(false);
                clearOtpInputs();
              }}
            >
              Go Back
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
}
