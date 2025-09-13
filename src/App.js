import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthWithOTP from "./components/AuthForm";
import Home from "./components/Homepage";
import ProtectedRoute from "./ProtectedRoute";
import LandindgPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthWithOTP />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <LandindgPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
