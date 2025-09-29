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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { MonetizationOn } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CropProgressBar from "./CropProgressbar";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import useLanguage from "../hooks/useLanguage";
import { translations } from "../utils/translations";

ChartJS.register(ArcElement, ChartTooltip, Legend);

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
  crops:
    (storedUser.prevCrops?.split(", ") || []).concat(
      storedUser.presentCrop ? [storedUser.presentCrop] : []
    ),
  presentCrop: storedUser.presentCrop || "",
};

const cropHistory = [
  {
    cropYear: "2024-2025",
    currentCrop: "Banana",
    previousCrops: ["Rice", "Turmeric"],
    fertilizersUsed: ["Urea", "Compost"],
  },
];

const cropStages = [
  "Land Preparation",
  "Nursery Preparation & Seeding",
  "Transplanting",
  "Vegetative Stage",
  "Reproductive Stage",
  "Maturity & Harvest",
];

const cropProgress = {
  completedDay: 34,
  savedAt: "2025-09-29T10:56:44.760Z",
  stagesCompleted: 4,
  percentage: "32%",
};

export default function FarmerProfile() {
  const navigate = useNavigate();
  const language = useLanguage();

  const [farmerData, setFarmerData] = useState(initialFarmerData);
  const [preview, setPreview] = useState(initialFarmerData.profileImage);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedData, setEditedData] = useState({ ...initialFarmerData });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!selectedImage) {
      setPreview(farmerData.profileImage);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage, farmerData.profileImage]);

  const handleEditOpen = () => {
    setEditedData({ ...farmerData });
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedImage(null);
    setPreview(farmerData.profileImage);
  };

  const handleFieldChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  // Upload image immediately on selection
  const uploadImage = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        "https://farmer-backend-dqit.onrender.com/api/auth/update-image",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Image upload failed");

      const updatedUser = {
        ...storedUser,
        imageUrl: data.imageUrl,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFarmerData((prev) => ({ ...prev, profileImage: data.imageUrl }));
      setPreview(data.imageUrl);
      setSelectedImage(null);
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      uploadImage(file);
    }
  };

  // Save profile info including current crop
  const handleSave = async () => {
    setLoading(true);
    try {
      const body = {
        mobile: farmerData.mobile,
        name: editedData.name,
        state: editedData.state,
        district: editedData.district,
        village: editedData.village,
        landType: editedData.landType,
        farmSize: editedData.farmSize,
        presentCrop: editedData.presentCrop, // ✅ allow updating current crop
      };

      const res = await fetch(
        "https://farmer-backend-dqit.onrender.com/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.user) {
        throw new Error(data.message || "Failed to update profile");
      }

      const rebuiltCrops = (data.user.prevCrops?.split(", ") || []).concat(
        data.user.presentCrop ? [data.user.presentCrop] : []
      );

      const updatedUser = {
        ...storedUser,
        ...data.user,
        imageUrl: data.user.imageUrl || storedUser.imageUrl,
        crops: rebuiltCrops,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFarmerData(updatedUser);
      setPreview(updatedUser.imageUrl || "/fallback.png");
      setIsEditOpen(false);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1100, mx: "auto" }}>
      {/* === Profile Card === */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar src={preview} sx={{ width: 96, height: 96 }} />
              <IconButton
                onClick={() => fileInputRef.current.click()}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "green",
                  color: "#fff",
                }}
                disabled={loading}
              >
                <UploadIcon />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Box>
            <Box>
              <Typography variant="h6">{farmerData.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {farmerData.village}, {farmerData.state}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              sx={{
                ml: "auto",
                height: 40,
                color: "black",
                borderColor: "#4caf50",
              }}
              onClick={handleEditOpen}
              disabled={loading}
            >
              Edit
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              Phone: {farmerData.mobile}
            </Grid>
            <Grid item xs={12} sm={6}>
              Land Type: {farmerData.landType}
            </Grid>
            <Grid item xs={12} sm={6}>
              Farm Size: {farmerData.farmSize} acres
            </Grid>
            <Grid item xs={12} sm={6}>
              Current Crop: {farmerData.presentCrop || "Not set"}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* === Crop Progress Bar === */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Crop Progress
          </Typography>
          <CropProgressBar
            stages={cropStages}
            stagesCompleted={cropProgress.stagesCompleted}
            percentage={cropProgress.percentage}
            completedDay={cropProgress.completedDay}
          />
        </CardContent>
      </Card>

      {/* === Crop History === */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#fff", mb: 3 }}>
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
                    <strong>{translations.profile.currentCrop[language]}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{translations.profile.previousCrops[language]}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{translations.profile.fertilizers[language]}</strong>
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

      {/* === Quick Navigation === */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div
          className="card"
          onClick={() => navigate("/dashboard/loans")}
          style={{
            cursor: "pointer",
            textAlign: "center",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "150px",
          }}
        >
          <MonetizationOn style={{ fontSize: 36, color: "#f57c00" }} />
          <p>Manage Loans</p>
        </div>

        <div
          className="card"
          onClick={() => navigate("/dashboard/cropcycle")}
          style={{
            cursor: "pointer",
            textAlign: "center",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            width: "150px",
          }}
        >
          <AgricultureIcon style={{ fontSize: 36, color: "#4caf50" }} />
          <p>Crop Cycle</p>
        </div>
      </div>

      {/* === Edit Dialog === */}
      <Dialog open={isEditOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Farmer Details</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {[
              { label: "Name", key: "name" },
              { label: "State", key: "state" },
              { label: "District", key: "district" },
              { label: "Village", key: "village" },
              { label: "Land Type", key: "landType" },
              { label: "Farm Size", key: "farmSize", type: "number" },
              { label: "Current Crop", key: "presentCrop" }, // ✅ new field
            ].map(({ label, key, type = "text" }) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={label}
                  type={type}
                  fullWidth
                  value={editedData[key]}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  disabled={loading}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
