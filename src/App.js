import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthWithOTP from "./components/AuthForm";
import Home from "./components/Homepage";
import ProtectedRoute from "./ProtectedRoute";

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
      </Routes>
    </Router>
  );
}

export default App;
