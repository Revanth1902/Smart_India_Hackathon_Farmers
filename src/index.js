import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

<link
  href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600&display=swap"
  rel="stylesheet"
/>;

/* Farmer theme: greens, earth tones */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2f855a" }, // deep green
    secondary: { main: "#b76e09" }, // earth/orange
    background: { default: "#f6fbf7" },
  },

  typography: {
    fontFamily: '"Exo 2", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-right" autoClose={3000} />
  </ThemeProvider>
);
