import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "./GraphComponent";
import NavBar from "./NavBar";
import "../CSS/ResultsPage.css";

export default function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="results-container">
      <NavBar />

      <header className="home-header">
          <img
            src="/Texas_Tech_Logo.png"
            alt="Texas Tech Logo"
            className="texas-tech-logo"
          />
          <h1 className="results-title">Results</h1>
      </header>

      <div className="graph-section">
        <GraphComponent />
      </div>

      <button
        onClick={() => navigate("/FinalSchedule")}
        className="schedule-button"
      >
        See Final Schedule
      </button>
    </div>
  );
}
