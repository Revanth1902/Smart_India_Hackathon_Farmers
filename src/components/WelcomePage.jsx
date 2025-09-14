import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english"); // Default language

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleGetStartedClick = () => {
    localStorage.setItem("welcomeCompleted", "true");

    // Save selected language
    localStorage.setItem("farmerLanguage", language);
    // OR use cookies if preferred
    // Cookies.set("farmerLanguage", language);

    const authToken = Cookies.get("authToken");

    if (authToken) {
      navigate("/dashboard/landing");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="welcome-container">
      <div className="image-placeholder">
        <img src="/Framer-Welcome.jpg" alt="Meditation illustration" />
      </div>

      <div className="content-area">
        <h1>Welcome User</h1>
        <p>Let's get started</p>

        {/* Language selection dropdown */}
        <div className="language-select">
          <label htmlFor="language">Select Language:</label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="english">English</option>
            <option value="malayalam">Malayalam</option>
          </select>
        </div>

        <button className="start-button" onClick={handleGetStartedClick}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
