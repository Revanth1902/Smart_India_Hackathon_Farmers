import React from "react";
import "../styles/CropProgressBar.css";

const CropProgressBar = ({
  stages,
  stagesCompleted,
  percentage,
  completedDay,
}) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-track">
        <div
          className="progress-filled"
          style={{ width: `${percentage}` }}
        ></div>
      </div>

      <div
        className="progress-tooltip"
        style={{ left: `calc(${percentage} - 18px)` }}
      >
        {percentage}
      </div>

      <div className="stages-container">
        {stages.map((stage, index) => (
          <div key={index} className="stage">
            <div
              className={`stage-marker ${
                index < stagesCompleted ? "completed" : ""
              }`}
            ></div>
            <div
              className={`stage-label ${
                index < stagesCompleted ? "completed-label" : ""
              }`}
            >
              {stage}
            </div>
          </div>
        ))}
      </div>
      <div className="completed-day">Day: {completedDay}</div>
    </div>
  );
};

export default CropProgressBar;
