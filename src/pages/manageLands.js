import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";

// --- Helpers for localStorage ---
const STORAGE_KEY = "lands_for_lease";

const loadLandsFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLandsToStorage = (lands) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lands));
};

const validateLand = (land) => {
  const errors = {};
  const sizeRegex = /^\d+(\.\d+)?\s*$/i;
  const contactRegex = /^[0-9]{10}$/;

  if (!land.size || !sizeRegex.test(land.size)) {
    errors.size = "Enter valid size in acres (e.g., 1.5 acres)";
  }
  if (!land.price) {
    errors.price = "Price is required";
  }
  if (!land.description) {
    errors.description = "Description is required";
  }
  if (!land.contact || !contactRegex.test(land.contact)) {
    errors.contact = "Enter valid 10-digit contact number";
  }

  return errors;
};

const ManageLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLand, setNewLand] = useState({
    size: "",
    price: "",
    description: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const storedLands = loadLandsFromStorage();
      setLands(storedLands);
      setLoading(false);
    }, 1500); // Dummy loading effect
  }, []);

  // Save to localStorage on any lands update
  useEffect(() => {
    saveLandsToStorage(lands);
  }, [lands]);

  const handleInputChange = (e) => {
    setNewLand({ ...newLand, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error
  };

  const handleAddLand = () => {
    const validationErrors = validateLand(newLand);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newEntry = {
      ...newLand,
      id: Date.now(),
      isEditing: false,
    };

    setLoading(true);
    setTimeout(() => {
      setLands([newEntry, ...lands]);
      setNewLand({ size: "", price: "", description: "", contact: "" });
      setErrors({});
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setLands(lands.filter((land) => land.id !== id));
  };

  const handleEditToggle = (id) => {
    setLands(
      lands.map((land) =>
        land.id === id ? { ...land, isEditing: !land.isEditing } : land
      )
    );
  };

  const handleEditChange = (id, field, value) => {
    setLands(
      lands.map((land) => (land.id === id ? { ...land, [field]: value } : land))
    );
  };

  const handleSaveEdit = (id) => {
    const editingLand = lands.find((l) => l.id === id);
    const validationErrors = validateLand(editingLand);
    if (Object.keys(validationErrors).length > 0) {
      alert("Fix validation errors before saving.");
      return;
    }

    setLands(
      lands.map((land) =>
        land.id === id ? { ...land, isEditing: false } : land
      )
    );
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        backgroundColor: "#f1f8e9",
        borderRadius: 2,
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#33691e" }}>
        🌾 Manage Land Leases
      </Typography>

      {/* Form */}
      <Typography variant="h6" gutterBottom>
        Add New Land
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {["size", "price", "description", "contact"].map((field) => (
          <Grid item xs={12} sm={field === "description" ? 12 : 6} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={newLand[field]}
              onChange={handleInputChange}
              error={!!errors[field]}
              helperText={errors[field]}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#689f38",
              "&:hover": { backgroundColor: "#558b2f" },
            }}
            onClick={handleAddLand}
          >
            Add Land
          </Button>
        </Grid>
      </Grid>

      {/* Loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={50} color="success" />
        </Box>
      ) : (
        <>
          {/* Listed Lands */}
          <Typography variant="h6" gutterBottom>
            Listed Lands
          </Typography>
          <Grid container spacing={3}>
            {lands.map((land) => (
              <Grid item xs={12} sm={6} key={land.id}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "#ffffff",
                    borderColor: "#c5e1a5",
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    {land.isEditing ? (
                      <>
                        {["size", "price", "description", "contact"].map(
                          (field) => (
                            <TextField
                              key={field}
                              fullWidth
                              margin="dense"
                              label={
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }
                              value={land[field]}
                              onChange={(e) =>
                                handleEditChange(land.id, field, e.target.value)
                              }
                            />
                          )
                        )}
                        <Box mt={1} display="flex" justifyContent="flex-end">
                          <IconButton onClick={() => handleSaveEdit(land.id)}>
                            <Save color="success" />
                          </IconButton>
                          <IconButton onClick={() => handleEditToggle(land.id)}>
                            <Cancel color="error" />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography>
                          <strong>Size:</strong> {land.size}
                        </Typography>
                        <Typography>
                          <strong>Price:</strong> {land.price}
                        </Typography>
                        <Typography>
                          <strong>Description:</strong> {land.description}
                        </Typography>
                        <Typography>
                          <strong>Contact:</strong> {land.contact}
                        </Typography>
                        <Box mt={1} display="flex" justifyContent="flex-end">
                          <IconButton onClick={() => handleEditToggle(land.id)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(land.id)}>
                            <Delete color="error" />
                          </IconButton>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {lands.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">No lands listed for lease yet.</Alert>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ManageLands;
