import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./styles/home.css";

/* Farmer theme: greens, earth tones */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2f855a" }, // deep green
    secondary: { main: "#b76e09" }, // earth/orange
    background: { default: "#f6fbf7" },
  },
  typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
