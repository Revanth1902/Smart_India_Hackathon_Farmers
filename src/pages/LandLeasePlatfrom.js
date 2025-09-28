import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Utility
const DAYS_TO_MS = 1000 * 60 * 60 * 24 * 30;

// Dummy Listings (20+)
const dummyLeases = [
  {
    id: 1,
    location: "Muvattupuzha, State Kerala",
    price: "₹10000 / year",
    size: "1.0 acres",
    contact: "9876510000",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 2,
    location: "Alappuzha, State Kerala",
    price: "₹11000 / year",
    size: "2.1 acres",
    contact: "9876510001",
    description: "Fertile land ideal for spices, near water source.",
  },
  {
    id: 3,
    location: "Kottayam, State Kerala",
    price: "₹12000 / year",
    size: "3.2 acres",
    contact: "9876510002",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 4,
    location: "Thrissur, State Kerala",
    price: "₹13000 / year",
    size: "4.3 acres",
    contact: "9876510003",
    description: "Fertile land ideal for spices, near water source.",
  },
  {
    id: 5,
    location: "Wayanad, State Kerala",
    price: "₹14000 / year",
    size: "5.4 acres",
    contact: "9876510004",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 6,
    location: "Kasaragod, State Kerala",
    price: "₹15000 / year",
    size: "1.5 acres",
    contact: "9876510005",
    description: "Fertile land ideal for spices, near water source.",
  },
  {
    id: 7,
    location: "Palakkad, State Kerala",
    price: "₹16000 / year",
    size: "2.6 acres",
    contact: "9876510006",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 8,
    location: "Kozhikode, State Kerala",
    price: "₹17000 / year",
    size: "3.7 acres",
    contact: "9876510007",
    description: "Fertile land ideal for spices, near water source.",
  },
  {
    id: 9,
    location: "Idukki, State Kerala",
    price: "₹18000 / year",
    size: "4.8 acres",
    contact: "9876510008",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 10,
    location: "Malappuram, State Kerala",
    price: "₹19000 / year",
    size: "5.9 acres",
    contact: "9876510009",
    description: "Fertile land ideal for spices, near water source.",
  },
  {
    id: 11,
    location: "Pathanamthitta, State Kerala",
    price: "₹20000 / year",
    size: "1.0 acres",
    contact: "9876510010",
    description: "Fertile land ideal for paddy, near water source.",
  },
  {
    id: 12,
    location: "Ernakulam, State Kerala",
    price: "₹21000 / year",
    size: "2.1 acres",
    contact: "9876510011",
    description: "Fertile land ideal for spices, near water source.",
  },
];
const LandLeasePlatform = () => {
  const navigate = useNavigate();

  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [selectedLease, setSelectedLease] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    location: "",
    price: "",
    size: "",
    contact: "",
    description: "",
  });

  // Load data from localStorage or fallback to dummyLeases
  useEffect(() => {
    const stored = localStorage.getItem("leases");
    const timestamp = localStorage.getItem("leases_timestamp");

    setLoading(true);

    setTimeout(() => {
      if (stored && timestamp && Date.now() - timestamp < DAYS_TO_MS) {
        setLeases(JSON.parse(stored));
      } else {
        localStorage.setItem("leases", JSON.stringify(dummyLeases));
        localStorage.setItem("leases_timestamp", Date.now());
        setLeases(dummyLeases);
      }
      setLoading(false);
    }, 2000); // Simulated delay
  }, []);

  // Add New Lease Handler
  const handleAddLease = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newLease = { id: Date.now(), ...form };
      const updatedLeases = [newLease, ...leases];
      setLeases(updatedLeases);
      localStorage.setItem("leases", JSON.stringify(updatedLeases));
      localStorage.setItem("leases_timestamp", Date.now());

      setForm({
        location: "",
        price: "",
        size: "",
        contact: "",
        description: "",
      });

      setShowForm(false);
      setSelectedLease(null);
      setLoading(false);
    }, 2000);
  };

  // Filter + Sort Logic
  const filteredLeases = leases
    .filter(
      (lease) =>
        lease.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.size.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const getSize = (val) => parseFloat(val.split(" ")[0]);
      const getPrice = (val) => parseInt(val.replace(/[₹,/ ]/g, ""));

      switch (sortOption) {
        case "price-low":
          return getPrice(a.price) - getPrice(b.price);
        case "price-high":
          return getPrice(b.price) - getPrice(a.price);
        case "size-low":
          return getSize(a.size) - getSize(b.size);
        case "size-high":
          return getSize(b.size) - getSize(a.size);
        default:
          return 0;
      }
    });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌾 Land Lease Management</h1>

      {/* Top Bar */}
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by location or size..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.select}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="size-low">Size: Small to Large</option>
          <option value="size-high">Size: Large to Small</option>
        </select>

        <button
          style={styles.addBtn}
          onClick={() => navigate("/dashboard/manage-lease")}
        >
          Manage Land Leases
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div style={styles.loader}>⏳ Loading land leases...</div>
      ) : (
        <>
          {/* Lease Cards */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Available Land Leases</h2>
            <div style={styles.grid}>
              {filteredLeases.map((lease) => (
                <div
                  key={lease.id}
                  style={styles.card}
                  onClick={() => setSelectedLease(lease)}
                >
                  <h3 style={styles.cardTitle}>{lease.location}</h3>
                  <p>📏 {lease.size}</p>
                  <p>💰 {lease.price}</p>
                </div>
              ))}
              {filteredLeases.length === 0 && (
                <p style={{ color: "#888" }}>No matches found.</p>
              )}
            </div>
          </div>

          {/* Lease Details */}
          {selectedLease && (
            <div style={styles.modalOverlay}>
              <div style={styles.modal}>
                <button
                  onClick={() => setSelectedLease(null)}
                  style={styles.closeBtn}
                >
                  ✖
                </button>
                <h2 style={{ marginBottom: 10 }}>{selectedLease.location}</h2>
                <p>
                  <strong>Size:</strong> 📏 {selectedLease.size}
                </p>
                <p>
                  <strong>Price:</strong> 💰 {selectedLease.price}
                </p>
                <p>
                  <strong>Description:</strong> 📝 {selectedLease.description}
                </p>
                <p>
                  <strong>Contact:</strong> 📞 {selectedLease.contact}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
// 🌿 Styles
const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: "20px",
    background: "#f0fff4",
    color: "#2e4d2e",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    color: "#336633",
    marginBottom: "20px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    gap: "10px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: "1",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minWidth: "200px",
  },
  addBtn: {
    background: "#388e3c",
    color: "white",
    padding: "10px 15px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    borderBottom: "2px solid #88cc88",
    paddingBottom: "5px",
    marginBottom: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  card: {
    background: "#e7fce7",
    padding: "15px",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    minWidth: "180px",
    background: "#fff",
    color: "#333",
  },

  cardTitle: {
    margin: "0 0 10px",
    color: "#225522",
  },
  detailBox: {
    background: "#ffffff",
    padding: "20px",
    border: "2px solid #88cc88",
    borderRadius: "10px",
    marginBottom: "30px",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#666",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  submitBtn: {
    background: "#4caf50",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  loader: {
    textAlign: "center",
    fontSize: "18px",
    padding: "30px",
    color: "#666",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#fff",
    padding: "25px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    position: "relative",
  },
};

export default LandLeasePlatform;
