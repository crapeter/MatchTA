import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { TAResultsChart, TAPieChart } from "./TACharts";
import GraphComponent from "./GraphComponent";

import NavBar from "./NavBar";

export default function ResultsPage() {
  const nav = useNavigate();
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    // Check if file was saved previously in sessionStorage
    const fileData = sessionStorage.getItem("capstoneBlob");
    if (fileData) {
      const byteArray = new Uint8Array(JSON.parse(fileData));
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      parseExcel(blob);
    }
  }, []);

  const toHomePage = () => {
    nav("/");
  };

  const parseExcel = (blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const graphData = { nodes: [], links: [] };
      const barChart = [];
      const pieMap = {};

      json.forEach((row) => {
        const course = `${row["Course Number"]}-${row["Section Number"]}`;
        graphData.nodes.push({ id: course, group: "course" });

        const tas = row["Assignment"]
          .split(",")
          .map((ta) => ta.replace("TA: ", "").trim());
        tas.forEach((ta, i) => {
          if (!graphData.nodes.some((n) => n.id === ta)) {
            graphData.nodes.push({ id: ta, group: "ta" });
          }
          const weight = 4 - i; // decreasing weight for lower-ranked TAs
          graphData.links.push({ source: ta, target: course, weight });
          barChart.push({ ta, weight });
          pieMap[ta] = (pieMap[ta] || 0) + weight;
        });
      });

      const pieChart = Object.entries(pieMap).map(([ta, value]) => ({
        ta,
        value,
      }));

      setGraphData(graphData);
      setBarData(barChart);
      setPieData(pieChart);
    };
    reader.readAsArrayBuffer(blob);
  };

  return (
    <div className="results-page">
      <NavBar />
      <h1>Results Overview</h1>

      <section>
        <h2>Bipartite Graph of TA Assignments</h2>
        <GraphComponent graphData={graphData} />
      </section>

      <section>
        <h2>TA Assignment Weights</h2>
        <TAResultsChart taAssignments={barData} />
      </section>

      <section>
        <h2>TA Workload Distribution</h2>
        <TAPieChart pieData={pieData} />
      </section>

      <button onClick={toHomePage} className="restart-button">
        Restart
      </button>
    </div>
  );
}
