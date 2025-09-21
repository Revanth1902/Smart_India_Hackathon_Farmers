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
import locationData from "../India-State-District.json"; // ⬅️ Make sure this file is correct

export default function AuthForm() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [otpSent, setOtpSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [landType, setLandType] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [prevCrops, setPrevCrops] = useState("");
  const [presentCrop, setPresentCrop] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [testOtp, setTestOtp] = useState("");

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  const otpInputsRef = useRef([]);

  const API_BASE = "https://farmer-backend-dqit.onrender.com/api/auth";

  useEffect(() => {
    const uniqueStates = locationData.map((item) => item.name).sort();
    setStatesList(uniqueStates);
  }, []);

  useEffect(() => {
    if (tab === 1) getLocation();
  }, [tab]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        toast.success("Location fetched successfully.");
        setLoading(false);
      },
      () => {
        toast.error("Please allow location access to continue.");
        setLoading(false);
      }
    );
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setOtpSent(false);
    setMobile("");
    setName("");
    setEmail("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setLandType("");
    setFarmSize("");
    setPrevCrops("");
    setPresentCrop("");
    setLatitude("");
    setLongitude("");
    setDistrictsList([]);
    clearOtpInputs();
    setTestOtp("");
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedDistrict("");
    setSelectedVillage("");
    const found = locationData.find((item) => item.name === state);
    setDistrictsList(found ? found.districts.sort() : []);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedVillage("");
  };

  const clearOtpInputs = () => {
    otpInputsRef.current.forEach((input) => input && (input.value = ""));
  };

  const handleOtpInput = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!mobile.match(/^\d{10}$/)) {
      toast.error("Enter a valid 10-digit mobile number.");
      return;
    }

    if (tab === 1) {
      if (!name.trim() || !email.trim()) {
        toast.error("Name and Email are required.");
        return;
      }
      if (!selectedState || !selectedDistrict || !selectedVillage) {
        toast.error("Please complete location details.");
        return;
      }
      if (!landType || !farmSize || !prevCrops || !presentCrop) {
        toast.error("Please fill all farm details.");
        return;
      }
      if (!latitude || !longitude) {
        toast.error("Location not available. Please allow GPS.");
        return;
      }
    }

    try {
      setLoading(true);

      const cleanedPrevCrops = prevCrops
        .split(",")
        .map((crop) => crop.trim())
        .filter((crop) => crop !== "")
        .join(", ");

      const payload = {
        mobile,
        ...(tab === 1 && {
          name,
          email,
          state: selectedState,
          district: selectedDistrict,
          village: selectedVillage,
          landType,
          farmSize,
          prevCrops: cleanedPrevCrops,
          presentCrop,
          latitude,
          longitude,
        }),
      };

      const response = await axios.post(
        `${API_BASE}/${tab === 1 ? "register" : "login"}`,
        payload
      );

      toast.success("OTP sent successfully!");
      setOtpSent(true);
      clearOtpInputs();

      if (response.data.otp) {
        setTestOtp(response.data.otp);
        otpInputsRef.current.forEach((input, idx) => {
          if (input) input.value = response.data.otp[idx] || "";
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otp = otpInputsRef.current.map((input) => input?.value).join("");

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/verify`, { mobile, otp });
      const { token, user } = response.data;

      toast.success(`${tab === 0 ? "Login" : "Registration"} successful!`);

      Cookies.set("authToken", token, { expires: 30 });
      Cookies.set("user", JSON.stringify(user), { expires: 30 });

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "expiry",
        new Date(Date.now() + 30 * 86400000).toISOString()
      );

      navigate("/dashboard/landing");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
        <Box textAlign="center" mb={2}>
          <FarmIcon fontSize="large" color="success" />
          <Typography variant="h4">Krishi Sakhi</Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="success"
          indicatorColor="success"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {!otpSent ? (
          <form onSubmit={sendOtp}>
            {tab === 1 && (
              <>
                {/* Full Name - Full Width */}
                <TextField
                  label="Full Name"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                {/* Email & Mobile - Side by Side */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Mobile Number"
                    fullWidth
                    margin="normal"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    inputProps={{ maxLength: 10 }}
                    required
                    sx={{ flex: 1 }}
                  />
                </Box>

                {/* State & District - Side by Side */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    sx={{ flex: 1 }}
                  >
                    <InputLabel>State</InputLabel>
                    <Select
                      value={selectedState}
                      onChange={handleStateChange}
                      label="State"
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
                    sx={{ flex: 1 }}
                  >
                    <InputLabel>District</InputLabel>
                    <Select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      label="District"
                    >
                      {districtsList.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Village - Full Width */}
                <TextField
                  label="Village"
                  fullWidth
                  margin="normal"
                  value={selectedVillage}
                  onChange={(e) => setSelectedVillage(e.target.value)}
                  required
                />

                {/* Land Type & Farm Size - Side by Side */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    sx={{ flex: 1 }}
                  >
                    <InputLabel>Land Type</InputLabel>
                    <Select
                      value={landType}
                      onChange={(e) => setLandType(e.target.value)}
                      label="Land Type"
                    >
                      <MenuItem value="Owned">Owned</MenuItem>
                      <MenuItem value="Leased">Leased</MenuItem>
                      <MenuItem value="Rented">Rented</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Farm Size (acres)"
                    fullWidth
                    margin="normal"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                </Box>

                {/* Crops grown in last 5 years - Full Width */}
                <TextField
                  label="Crops grown in last 5 years"
                  fullWidth
                  margin="normal"
                  value={prevCrops}
                  onChange={(e) => setPrevCrops(e.target.value)}
                  required
                />

                {/* Present Crop - Full Width */}
                <TextField
                  label="Present Crop"
                  fullWidth
                  margin="normal"
                  value={presentCrop}
                  onChange={(e) => setPresentCrop(e.target.value)}
                  required
                />

                {/* Latitude & Longitude - Side by Side */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: "row" }}>
                  <TextField
                    label="Latitude"
                    fullWidth
                    margin="normal"
                    value={latitude}
                    InputProps={{ readOnly: true }}
                    required
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="Longitude"
                    fullWidth
                    margin="normal"
                    value={longitude}
                    InputProps={{ readOnly: true }}
                    required
                    sx={{ flex: 1 }}
                  />
                </Box>
              </>
            )}

            {/* If tab is Login (0), just Mobile Number full width */}
            {tab === 0 && (
              <TextField
                label="Mobile Number"
                fullWidth
                margin="normal"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                inputProps={{ maxLength: 10 }}
                required
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <Typography align="center" mt={2} mb={1}>
              Enter the 6-digit OTP
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mb={2}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <TextField
                  key={i}
                  inputRef={(el) => (otpInputsRef.current[i] = el)}
                  onChange={(e) => handleOtpInput(e, i)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "20px" },
                  }}
                  sx={{ width: "45px" }}
                />
              ))}
            </Box>
            {testOtp && (
              <Typography align="center" color="textSecondary">
                🔐 Test OTP: <strong>{testOtp}</strong>
              </Typography>
            )}
            <Button type="submit" variant="contained" color="success" fullWidth>
              Verify OTP
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                setOtpSent(false);
                clearOtpInputs();
                setTestOtp("");
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
