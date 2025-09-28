// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Grid,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Button,
//   CircularProgress,
//   Tooltip,
// } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";

// import useLanguage from "../hooks/useLanguage";
// import { translations } from "../utils/translations";

// // Load user from localStorage
// // Read from localStorage and parse JSON
// const storedUser = JSON.parse(localStorage.getItem("user")) || {};

// const initialFarmerData = {
//   name: storedUser.name || "Default Name",
//   mobile: storedUser.mobile || "+91 XXXXXX",
//   state: storedUser.state || "Unknown",
//   district: storedUser.district || "Unknown",
//   village: storedUser.village || "Unknown",
//   landType: storedUser.landType || "Unknown",
//   farmSize: storedUser.farmSize || "0",
//   profileImage: storedUser.imageUrl || "/fallback.png",
//   crops: (storedUser.prevCrops?.split(", ") || []).concat(
//     storedUser.presentCrop ? [storedUser.presentCrop] : []
//   ),
// };

// const cropHistory = [
//   {
//     cropYear: "2024-2025",
//     currentCrop: "Banana",
//     previousCrops: ["Rice", "Turmeric"],
//     fertilizersUsed: ["Urea", "Compost"],
//   },
//   {
//     cropYear: "2023-2024",
//     currentCrop: "Coconut",
//     previousCrops: ["Banana", "Chili"],
//     fertilizersUsed: ["NPK", "Vermicompost"],
//   },
// ];

// export default function FarmerProfile() {
//   const language = useLanguage();
//   const [farmerData, setFarmerData] = useState(initialFarmerData);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [preview, setPreview] = useState(initialFarmerData.profileImage);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setFarmerData((prev) => ({
//         ...prev,
//         name: storedUser.name || prev.name,
//         mobile: storedUser.mobile || prev.mobile,
//         state: storedUser.state || prev.state,
//         district: storedUser.district || prev.district,
//         village: storedUser.village || prev.village,
//         profileImage: storedUser.imageUrl || prev.profileImage,
//       }));

//       setPreview(
//         storedUser.imageUrl || storedUser.profileImage || "/farmerprofile.jpg"
//       );
//     }
//   }, []);

//   const fileInputRef = useRef();

//   useEffect(() => {
//     if (!selectedImage) {
//       setPreview(farmerData.profileImage);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(selectedImage);
//     setPreview(objectUrl);

//     return () => URL.revokeObjectURL(objectUrl);
//   }, [selectedImage, farmerData.profileImage]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImage(file);
//       setSuccess(false);
//       setErrorMsg("");
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSave = async () => {
//     if (!selectedImage) {
//       setErrorMsg(
//         translations.profile.selectImageFirst?.[language] ||
//           "Please select an image before saving."
//       );
//       return;
//     }

//     setLoading(true);
//     setErrorMsg("");
//     setSuccess(false);

//     try {
//       const formData = new FormData();
//       formData.append("image", selectedImage);
//       formData.append("mobile", farmerData.mobile);
//       formData.append("name", farmerData.name);
//       formData.append("state", farmerData.state);
//       formData.append("district", farmerData.district);
//       formData.append("village", farmerData.village);

//       const response = await fetch(
//         "https://farmer-backend-dqit.onrender.com/api/auth/update",
//         {
//           method: "PUT",
//           body: formData,
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.user && data.user.imageUrl) {
//         const updatedImage = data.user.imageUrl;

//         // Get latest user from localStorage (or create new one)
//         const existingUser = JSON.parse(localStorage.getItem("user")) || {};

//         // Remove previous imageUrl if it exists
//         delete existingUser.imageUrl;

//         // Store the new imageUrl in localStorage along with updated user details
//         const updatedUser = {
//           ...existingUser,
//           imageUrl: updatedImage,
//           name: data.user.name || existingUser.name,
//           mobile: data.user.mobile || existingUser.mobile,
//           state: data.user.state || existingUser.state,
//           district: data.user.district || existingUser.district,
//           village: data.user.village || existingUser.village,
//         };

//         localStorage.setItem("user", JSON.stringify(updatedUser));

//         // Update state to reflect new image immediately
//         setFarmerData((prev) => ({
//           ...prev,
//           profileImage: updatedImage,
//           name: updatedUser.name,
//           mobile: updatedUser.mobile,
//           state: updatedUser.state,
//           district: updatedUser.district,
//           village: updatedUser.village,
//         }));

//         setPreview(updatedImage);
//         setSuccess(true);
//         setSelectedImage(null);
//       } else {
//         setErrorMsg(data.message || "Failed to update profile");
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       setErrorMsg("Network error: Could not update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         p: { xs: 2, sm: 4 },
//         maxWidth: 900,
//         mx: "auto",
//         minHeight: "100vh",
//       }}
//     >
//       {/* === Profile Card === */}
//       <Card
//         sx={{
//           borderRadius: 3,
//           boxShadow: 3,
//           background: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(10px)",
//           WebkitBackdropFilter: "blur(10px)",
//           border: "1px solid rgba(255, 255, 255, 0.3)",
//           mb: 4,
//         }}
//       >
//         <CardContent>
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               gap: 3,
//               flexWrap: "wrap",
//               mb: 2,
//             }}
//           >
//             <Box sx={{ position: "relative", display: "inline-block" }}>
//               <Avatar
//                 src={preview}
//                 alt={farmerData.name}
//                 sx={{
//                   width: 96,
//                   height: 96,
//                   border: "3px solid #2f855a",
//                   transition: "0.3s ease",
//                 }}
//               />
//               <Tooltip title={translations.profile.changePic[language]}>
//                 <IconButton
//                   onClick={handleUploadClick}
//                   sx={{
//                     position: "absolute",
//                     bottom: 0,
//                     right: 0,
//                     bgcolor: "rgba(47, 133, 90, 0.85)",
//                     color: "#fff",
//                     "&:hover": {
//                       bgcolor: "#2f855a",
//                       transform: "scale(1.1)",
//                       transition: "0.3s ease",
//                     },
//                     boxShadow: "0 0 10px 2px rgba(47, 133, 90, 0.7)",
//                     borderRadius: "50%",
//                   }}
//                 >
//                   <UploadIcon />
//                 </IconButton>
//               </Tooltip>
//               <input
//                 type="file"
//                 accept="image/*"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//               />
//             </Box>

//             <Box>
//               <Typography variant="h5" fontWeight="bold" gutterBottom>
//                 {farmerData.name}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {translations.profile.title[language]}
//               </Typography>
//             </Box>
//           </Box>

//           <Divider sx={{ mb: 3 }} />

//           {/* Details Grid */}
//           <Grid container spacing={3}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.phone[language]}
//               </Typography>
//               <Typography variant="body1">{farmerData.mobile}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.email[language]}
//               </Typography>
//               <Typography variant="body1">{farmerData.email}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.location[language]}
//               </Typography>
//               <Typography variant="body1">
//                 {farmerData.village}, {farmerData.state}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.landType[language]}
//               </Typography>
//               <Typography variant="body1">{farmerData.landType}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.farmSize[language]}
//               </Typography>
//               <Typography variant="body1">{farmerData.farmSize}</Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle2" color="text.secondary">
//                 {translations.profile.crops[language]}
//               </Typography>
//               <Typography variant="body1">
//                 {farmerData.crops.join(", ")}
//               </Typography>
//             </Grid>
//           </Grid>

//           <Box
//             sx={{
//               mt: 3,
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//               flexWrap: "wrap",
//             }}
//           >
//             {selectedImage && (
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={handleSave}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <CircularProgress size={24} color="inherit" />
//                 ) : (
//                   translations.profile.save[language]
//                 )}
//               </Button>
//             )}
//             {success && (
//               <Typography
//                 color="success.main"
//                 sx={{ display: "flex", alignItems: "center", gap: 1 }}
//               >
//                 <CheckCircleIcon /> {translations.profile.success[language]}
//               </Typography>
//             )}
//             {errorMsg && (
//               <Typography
//                 color="error"
//                 sx={{ display: "flex", alignItems: "center", gap: 1 }}
//               >
//                 <CancelIcon /> {errorMsg}
//               </Typography>
//             )}
//           </Box>
//         </CardContent>
//       </Card>

//       {/* === Crop History === */}
//       <Card sx={{ borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             {translations.profile.cropHistory[language]}
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     <strong>{translations.profile.cropYear[language]}</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>
//                       {translations.profile.currentCrop[language]}
//                     </strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>
//                       {translations.profile.previousCrops[language]}
//                     </strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>
//                       {translations.profile.fertilizers[language]}
//                     </strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {cropHistory.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{item.cropYear}</TableCell>
//                     <TableCell>{item.currentCrop}</TableCell>
//                     <TableCell>{item.previousCrops.join(", ")}</TableCell>
//                     <TableCell>{item.fertilizersUsed.join(", ")}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }
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
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { Pie } from "react-chartjs-2";
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
];

const initialLoans = [
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
    next_payment_due_date: "2024-09-05",
  },
  {
    loan_id: "FEL-00305",
    farmer_name: "Rajeev Singh",
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

export default function FarmerProfile() {
  const language = useLanguage();
  const [farmerData, setFarmerData] = useState(initialFarmerData);
  const [preview, setPreview] = useState(initialFarmerData.profileImage);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const [loans, setLoans] = useState(initialLoans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    loan_purpose: "",
    loan_amount: "",
    interest_rate_pa: "",
    loan_term_years: "",
    loan_date_taken: "",
  });

  const handleAddLoan = () => {
    const id = `FCL-${Math.floor(Math.random() * 100000)}`;
    const loan = {
      ...newLoan,
      loan_id: id,
      loan_currency: "INR",
      repayment_frequency: "Monthly",
      emi_installment_amount: (
        newLoan.loan_amount /
        (newLoan.loan_term_years * 12)
      ).toFixed(2),
      total_payments_made: 0,
      total_amount_paid: 0,
      principal_outstanding: newLoan.loan_amount,
      next_payment_due_date: "TBD",
      monthly_due_date: 5,
      farmer_name: farmerData.name,
    };
    setLoans([...loans, loan]);
    setNewLoan({
      loan_purpose: "",
      loan_amount: "",
      interest_rate_pa: "",
      loan_term_years: "",
      loan_date_taken: "",
    });
    setIsModalOpen(false);
  };

  const pieChartData = {
    labels: loans.map((loan) => loan.loan_purpose),
    datasets: [
      {
        data: loans.map((loan) => loan.loan_amount),
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#e91e63"],
        borderWidth: 1,
      },
    ],
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
              >
                <UploadIcon />
              </IconButton>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />
            </Box>
            <Box>
              <Typography variant="h5">{farmerData.name}</Typography>
              <Typography variant="body2">
                {farmerData.village}, {farmerData.state}
              </Typography>
            </Box>
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
              Crops: {farmerData.crops.join(", ")}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* === Add Loan Button === */}
      <Box sx={{ mb: 3, textAlign: "right" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Loan
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#fff",
          marginBottom: "20px",
        }}
      >
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
      {/* === Loan Cards === */}
      <div>
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          All Loans
        </Typography>

        <Grid container spacing={2}>
          {loans.map((loan, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: "#fff7e6",
                  borderLeft: "6px solid #f57c00",
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Loan {index + 1}: {loan.loan_purpose}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />

                  <Typography>
                    <strong>Loan ID:</strong> {loan.loan_id}
                  </Typography>
                  <Typography>
                    <strong>Loan Amount:</strong> ₹
                    {loan.loan_amount.toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Interest Rate:</strong> {loan.interest_rate_pa}% per
                    year
                  </Typography>
                  <Typography>
                    <strong>Term:</strong> {loan.loan_term_years} years
                  </Typography>
                  <Typography>
                    <strong>Monthly EMI:</strong> ₹{loan.emi_installment_amount}
                  </Typography>
                  <Typography>
                    <strong>Amount Paid:</strong> ₹{loan.total_amount_paid}
                  </Typography>
                  <Typography>
                    <strong>Outstanding Amount:</strong> ₹
                    {loan.principal_outstanding}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      {/* === Chart === */}
      <Card sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Loan Distribution
        </Typography>
        <Pie data={pieChartData} />
      </Card>
      {/* === Add Loan Modal === */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-loan-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="add-loan-title" variant="h6" gutterBottom>
            Add New Loan
          </Typography>

          <TextField
            label="Loan Purpose"
            fullWidth
            margin="normal"
            value={newLoan.loan_purpose}
            onChange={(e) =>
              setNewLoan({ ...newLoan, loan_purpose: e.target.value })
            }
          />
          <TextField
            label="Loan Amount (INR)"
            fullWidth
            margin="normal"
            type="number"
            value={newLoan.loan_amount}
            onChange={(e) =>
              setNewLoan({
                ...newLoan,
                loan_amount: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Interest Rate (% p.a)"
            fullWidth
            margin="normal"
            type="number"
            value={newLoan.interest_rate_pa}
            onChange={(e) =>
              setNewLoan({
                ...newLoan,
                interest_rate_pa: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Loan Term (Years)"
            fullWidth
            margin="normal"
            type="number"
            value={newLoan.loan_term_years}
            onChange={(e) =>
              setNewLoan({
                ...newLoan,
                loan_term_years: parseFloat(e.target.value),
              })
            }
          />
          <TextField
            label="Date Taken"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newLoan.loan_date_taken}
            onChange={(e) =>
              setNewLoan({ ...newLoan, loan_date_taken: e.target.value })
            }
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddLoan}>
              Save Loan
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
