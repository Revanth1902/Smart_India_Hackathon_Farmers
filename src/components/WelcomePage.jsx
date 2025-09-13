import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/Welcome.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    localStorage.setItem("welcomeCompleted", "true");

    const authToken = Cookies.get("authToken");

    if (authToken) {
      navigate("/landing");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="welcome-container">
      <div className="image-placeholder">
        <img src="/Framer-Welcome.jpg " alt="Meditation illustration" />
      </div>

      <div className="content-area">
        <h1>Welcome User</h1>
        <p>Let's get started</p>
        <button className="start-button" onClick={handleGetStartedClick}>
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
