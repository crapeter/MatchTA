import React from "react";
import { useNavigate } from "react-router-dom";
import GraphComponent from "./GraphComponent";

export default function ResultsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h1>Results Page</h1>

      <GraphComponent />

      <button
        onClick={() => navigate("/FinalSchedule")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "1rem",
          position: "relative", // 
          zIndex: 1,
        }}
      >
        See Final Schedule
</button>

    </div>
  );
}
