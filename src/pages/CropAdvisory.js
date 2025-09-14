import React, { useState } from "react";
import { Agriculture, Spa, BugReport, CheckCircle } from "@mui/icons-material";
import "../styles/CropAdvisory.css";

const CropAdvisory = () => {
  const [crop, setCrop] = useState("Coconut");
  const [stage, setStage] = useState("Flowering");
  const [symptom, setSymptom] = useState("some rusty leaves");

  return (
    <div className="advisory-container">
      {/* Header */}
      <header className="advisory-header">
        <h1 className="app-title">KRISHI SAKHI</h1>
        <span className="app-subtitle">Crop Advisory System</span>
      </header>

      <main className="advisory-main">
        {/* Left Panel */}
        <section className="advisory-form-card">
          <h2>Crop Advisory</h2>
          <p>
            Get AI-powered diagnosis and treatment recommendations for your
            crops
          </p>

          <label>Crop Type</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option>Coconut</option>
            <option>Paddy</option>
            <option>Wheat</option>
          </select>

          <label>Growth Stage</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)}>
            <option>Seedling</option>
            <option>Vegetative</option>
            <option>Flowering</option>
            <option>Harvest</option>
          </select>

          <label>Symptoms/Issues</label>
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />

          <button className="get-btn">
            <BugReport /> Get Advisory
          </button>
        </section>

        {/* Right Panel */}
        <section className="advisory-results-card">
          <h2>Advisory Results</h2>

          <div className="results-section">
            <h3>Diagnosis</h3>
            <p>Based on coconut symptoms: some rusty leaves</p>
          </div>

          <div className="results-section">
            <h3>Treatment</h3>
            <div className="treatment-box">
              <p>
                Neem Oil Spray: Prepare a solution of Neem oil (Azadirachtin) at
                a concentration of 2-3% and spray thoroughly every 15–20 days.
              </p>
              <p>
                Wettable Sulphur: Spray at 0.5% concentration covering
                undersides of leaves.
              </p>
              <p>
                Release Predator Mites: Introduce predator mites to control
                Eriophyid mites.
              </p>
              <p>
                Proper Nutrition: Ensure balanced fertilization with urea,
                superphosphate, and potash.
              </p>
            </div>
          </div>

          <div className="results-section">
            <h3>Preventive Measures</h3>
            <ul className="preventive-list">
              <li>
                <CheckCircle /> Regular monitoring
              </li>
              <li>
                <CheckCircle /> Proper irrigation
              </li>
              <li>
                <CheckCircle /> Organic fertilizers
              </li>
            </ul>
          </div>

          <div className="confidence-score">
            <span>Confidence Score</span>
            <strong>85%</strong>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CropAdvisory;
