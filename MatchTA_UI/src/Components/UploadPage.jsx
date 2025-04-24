import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../CSS/UploadPage.css";

import NavBar from "./NavBar";

export default function UploadPage() {
  const { id } = useParams();
  const sheetNumber = parseInt(id);
  const nav = useNavigate();

  const [uploadedFile, setUploadedFile] = useState([]);
  const [fileTemplate, setFileTemplate] = useState([]);

  useEffect(() => {
    fetch(`/templates/file${sheetNumber}.xlsx`)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setFileTemplate(jsonData.slice(0, 10)); // Display first 10 rows, for example
      })
      .catch((err) => {
        console.error("Failed to load Excel template:", err);
      });
  }, [sheetNumber]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setUploadedFile(jsonData.slice(0, 10));
    };

    reader.readAsArrayBuffer(file);
  };

  const nextPage = () => {
    if (sheetNumber < 3) {
      nav(`/Upload/${sheetNumber + 1}`);
    } else {
      nav("/Results");
    }
  };

  const prevPage = () => {
    if (sheetNumber > 1) {
      nav(`/Upload/${sheetNumber - 1}`);
    } else {
      nav("/");
    }
  };

  return (
    <div className="upload-page">
      <NavBar />
      <h2>Upload Sheet {sheetNumber}</h2>
      <div className="container">
        <div className="left-container">
          <div className="example-file">
            <table>
              <tbody>
                {fileTemplate.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ border: "1px solid #ccc", padding: "4px" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-container">
          <div className="upload-file">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <table>
              <tbody>
                {uploadedFile.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ border: "1px solid #ccc", padding: "4px" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Button onClick={prevPage}>Previous</Button>
        <Button onClick={nextPage}>Continue</Button>
      </div>
    </div>
  );
}
