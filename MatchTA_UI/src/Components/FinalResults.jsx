import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import NavBar from "./NavBar";

export default function FinalSchedule() {
  const [finalRows, setFinalRows] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  useEffect(() => {
    const fileData = sessionStorage.getItem("capstoneBlob");
    if (fileData) {
      const byteArray = new Uint8Array(JSON.parse(fileData));
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setExcelBlob(blob);

      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setFinalRows(json);
      };
      reader.readAsArrayBuffer(blob);
    } else {
      console.error("No capstoneBlob found in sessionStorage.");
    }
  }, []);

  const handleDownload = () => {
    if (excelBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(excelBlob);
      link.download = "Capstone_Project.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("No Excel blob available for download.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <NavBar />
      <div style={{ marginBottom: "5rem" }}>
        <header className="home-header">
          <img
            src="/Texas_Tech_Logo.png"
            alt="Texas Tech Logo"
            className="texas-tech-logo"
          />
          <h1 className="title">Final Results</h1>
        </header>
      </div>

      <div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1.5rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Course
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Instructor
              </th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>
                Assignment
              </th>
            </tr>
          </thead>
          <tbody>
            {finalRows.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {row["Course Number"]}-{row["Section Number"]}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {row["Instructor"]}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                  {row["Assignment"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          variant="primary"
        >
          Download Schedule
        </Button>
        <Button
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/";
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          variant="danger"
        >
          Restart
        </Button>
      </div>
    </div>
  );
}
