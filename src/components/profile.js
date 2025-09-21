import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import useLanguage from "../hooks/useLanguage";
import { translations } from "../utils/translations";

// Load user from localStorage
// Read from localStorage and parse JSON
const storedUser = JSON.parse(localStorage.getItem("user")) || {};

const initialFarmerData = {
  name: storedUser.name || "Default Name",
  mobile: storedUser.mobile || "+91 XXXXXX",
  state: storedUser.state || "Unknown",
  district: storedUser.district || "Unknown",
  village: storedUser.village || "Unknown",
  landType: storedUser.landType || "Unknown",
  farmSize: storedUser.farmSize || "0",
  profileImage: storedUser.imageUrl || "/fallback.png",
  crops: (storedUser.prevCrops?.split(", ") || []).concat(
    storedUser.presentCrop ? [storedUser.presentCrop] : []
  ),
};

const cropHistory = [
  {
    cropYear: "2024-2025",
    currentCrop: "Banana",
    previousCrops: ["Rice", "Turmeric"],
    fertilizersUsed: ["Urea", "Compost"],
  },
  {
    cropYear: "2023-2024",
    currentCrop: "Coconut",
    previousCrops: ["Banana", "Chili"],
    fertilizersUsed: ["NPK", "Vermicompost"],
  },
];

export default function FarmerProfile() {
  const language = useLanguage();
  const [farmerData, setFarmerData] = useState(initialFarmerData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(initialFarmerData.profileImage);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setFarmerData((prev) => ({
        ...prev,
        name: storedUser.name || prev.name,
        mobile: storedUser.mobile || prev.mobile,
        state: storedUser.state || prev.state,
        district: storedUser.district || prev.district,
        village: storedUser.village || prev.village,
        profileImage: storedUser.imageUrl || prev.profileImage,
      }));

      setPreview(
        storedUser.imageUrl || storedUser.profileImage || "/farmerprofile.jpg"
      );
    }
  }, []);

  const fileInputRef = useRef();

  useEffect(() => {
    if (!selectedImage) {
      setPreview(farmerData.profileImage);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage, farmerData.profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSuccess(false);
      setErrorMsg("");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async () => {
    if (!selectedImage) {
      setErrorMsg(
        translations.profile.selectImageFirst?.[language] ||
          "Please select an image before saving."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("mobile", farmerData.mobile);
      formData.append("name", farmerData.name);
      formData.append("state", farmerData.state);
      formData.append("district", farmerData.district);
      formData.append("village", farmerData.village);

      const response = await fetch(
        "https://farmer-backend-dqit.onrender.com/api/auth/update",
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.user && data.user.imageUrl) {
        const updatedImage = data.user.imageUrl;

        // Get latest user from localStorage (or create new one)
        const existingUser = JSON.parse(localStorage.getItem("user")) || {};

        // Remove previous imageUrl if it exists
        delete existingUser.imageUrl;

        // Store the new imageUrl in localStorage along with updated user details
        const updatedUser = {
          ...existingUser,
          imageUrl: updatedImage,
          name: data.user.name || existingUser.name,
          mobile: data.user.mobile || existingUser.mobile,
          state: data.user.state || existingUser.state,
          district: data.user.district || existingUser.district,
          village: data.user.village || existingUser.village,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update state to reflect new image immediately
        setFarmerData((prev) => ({
          ...prev,
          profileImage: updatedImage,
          name: updatedUser.name,
          mobile: updatedUser.mobile,
          state: updatedUser.state,
          district: updatedUser.district,
          village: updatedUser.village,
        }));

        setPreview(updatedImage);
        setSuccess(true);
        setSelectedImage(null);
      } else {
        setErrorMsg(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Network error: Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: 900,
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      {/* === Profile Card === */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          mb: 4,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={preview}
                alt={farmerData.name}
                sx={{
                  width: 96,
                  height: 96,
                  border: "3px solid #2f855a",
                  transition: "0.3s ease",
                }}
              />
              <Tooltip title={translations.profile.changePic[language]}>
                <IconButton
                  onClick={handleUploadClick}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "rgba(47, 133, 90, 0.85)",
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "#2f855a",
                      transform: "scale(1.1)",
                      transition: "0.3s ease",
                    },
                    boxShadow: "0 0 10px 2px rgba(47, 133, 90, 0.7)",
                    borderRadius: "50%",
                  }}
                >
                  <UploadIcon />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {farmerData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translations.profile.title[language]}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.phone[language]}
              </Typography>
              <Typography variant="body1">{farmerData.mobile}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.email[language]}
              </Typography>
              <Typography variant="body1">{farmerData.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.location[language]}
              </Typography>
              <Typography variant="body1">
                {farmerData.village}, {farmerData.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.landType[language]}
              </Typography>
              <Typography variant="body1">{farmerData.landType}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.farmSize[language]}
              </Typography>
              <Typography variant="body1">{farmerData.farmSize}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                {translations.profile.crops[language]}
              </Typography>
              <Typography variant="body1">
                {farmerData.crops.join(", ")}
              </Typography>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {selectedImage && (
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  translations.profile.save[language]
                )}
              </Button>
            )}
            {success && (
              <Typography
                color="success.main"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckCircleIcon /> {translations.profile.success[language]}
              </Typography>
            )}
            {errorMsg && (
              <Typography
                color="error"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CancelIcon /> {errorMsg}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* === Crop History === */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {translations.profile.cropHistory[language]}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>{translations.profile.cropYear[language]}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>
                      {translations.profile.currentCrop[language]}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <strong>
                      {translations.profile.previousCrops[language]}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <strong>
                      {translations.profile.fertilizers[language]}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cropHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.cropYear}</TableCell>
                    <TableCell>{item.currentCrop}</TableCell>
                    <TableCell>{item.previousCrops.join(", ")}</TableCell>
                    <TableCell>{item.fertilizersUsed.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
