import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MatchTALogo from "./MatchTALogo.png";
import RobotImage from "./Buddy-Mouth Open.png";

import * as XLSX from "xlsx";

function App() {
  const [files, setFiles] = useState({ file1: null, file2: null, file3: null });
  const [progress, setProgress] = useState(0);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [numOfTas, setNumOfTas] = useState("1");
  const [previewData, setPreviewData] = useState({
    file1: [],
    file2: [],
    file3: [],
  });

  // Buddy Javascript stuff goes here -------------------------------------------------------------
  const [showTutorial, setShowTutorial] = useState(false);
  const handleFilePreview = (fileKey, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setPreviewData((prev) => ({ ...prev, [fileKey]: jsonData.slice(0, 5) })); // Preview top 5 rows
    };
    reader.readAsArrayBuffer(file);
  };
  const imageUrls = [RobotImage, RobotImage, RobotImage];

  // ----------------------------------------------------------------------------------------------

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [fileKey]: e.target.files[0] }));
    if (file) handleFilePreview(fileKey, file); // Trigger preview
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", files.file1);
    formData.append("file", files.file2);
    formData.append("file", files.file3);
    formData.append("num_of_tas", numOfTas);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
          onUploadProgress: (progressEvent) => {
            // Calculate the progress percentage
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent); // Update progress state
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Capstone_Project.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading files.");
    } finally {
      setProgress(0); // Reset progress after submission
    }
  };

  const downloadTemplates = () => {
    const filenames = ["file1.xlsx", "file2.xlsx", "file3.xlsx"];
    filenames.forEach((filename) => {
      const link = document.createElement("a");
      link.href = `/templates/${filename}`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  return (
    <div className="container">
      <header>
        <div className="header-container">
          <h1>MatchTA</h1>
          <img src={MatchTALogo} alt="Logo" className="logo" />
        </div>
        <p className="subheading">Optimized TA Management</p>
      </header>
      <div
        className="robot-container"
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          textAlign: "center",
        }}
        onClick={() => setShowTutorial(true)} // Show tutorial when clicked
      >
        <img
          src={RobotImage}
          alt="Robot"
          style={{ width: "50px", height: "50px" }}
        />
        <p style={{ color: "white", fontSize: "12px" }}>
          Hello! Click me for a tutorial!
        </p>
      </div>
      <Modal show={showTutorial} onHide={() => setShowTutorial(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Welcome to MatchTA!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here's a quick guide to help you get started with the app:</p>
          <ul>
            <li>Upload your TA documents using the buttons below.</li>
            <li>
              Download the templates to make sure your data is in the right
              format.
            </li>
            <li>Click "Submit" when you're ready to submit your files.</li>
          </ul>
          <p>
            For more help, you can watch this{" "}
            <a
              href="https://www.youtube.com/watch?v=LsxgUPBntyk"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube tutorial
            </a>
            .
          </p>
        </Modal.Body>
      </Modal>

      <div className="upload-section">
        <h2>Upload Your Files</h2>
        <div>
          <button className="download-btn" onClick={downloadTemplates}>
            Download Templates
          </button>
        </div>

        <div className="file-section">
          <h3>Excel Sheet 1:</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "file1")} />
          <button className="view-info-btn" onClick={() => setShowModal1(true)}>
            View Document Info
          </button>
        </div>

        <div className="file-section">
          <h3>Excel Sheet 2:</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "file2")} />
          <button className="view-info-btn" onClick={() => setShowModal2(true)}>
            View Document Info
          </button>
        </div>

        <div className="file-section">
          <h3>Excel Sheet 3:</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "file3")} />
          <button className="view-info-btn" onClick={() => setShowModal3(true)}>
            View Document Info
          </button>
        </div>

        <div>
          <h3>Number of TAs:</h3>
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
          >
            <select
              id="num-of-tas"
              value={numOfTas}
              onChange={(e) => setNumOfTas(e.target.value)}
              style={{maxHeight: "50px", overflowY: "auto"}}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              {imageUrls.slice(0, numOfTas).map((url, index) => (
                <img
                  key={index}
                  src={RobotImage}
                  alt="Buddy"
                  style={{ maxWidth: "50px", maxHeight: "50px" }}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Files
        </button>
        <div className="progress-bar-container">
          <progress
            value={progress}
            max="100"
            style={{ width: "100%", height: "20px" }}
          ></progress>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Modal 1 */}
      <Modal show={showModal1} onHide={() => setShowModal1(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excel Sheet 1 Columns</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>Headcount</li>
            <li>FTE count</li>
            <li>Applicant Name</li>
            <li>Research Advisor's Name</li>
            <li>TA Experience in CS Dept at TTU</li>
            <li>Preferred Courses with Grades (e.g., 5383(A), 6345(B))</li>
          </ul>

          <hr />

          {previewData.file1.length > 0 ? (
            <div id="preview-container">
              <table
                className="table table-bordered table-sm"
                id="preview-table"
              >
                <tbody>
                  {previewData.file1.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No preview available. Upload a file to see a preview.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal 2 */}
      <Modal show={showModal2} onHide={() => setShowModal2(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excel Sheet 2 Columns</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Sheet 1:</strong>
          </p>
          <ul>
            <li>TA/grader name</li>
            <li>Class schedule Spring 2025</li>
            <li>Courses enrolled Spring 2025</li>
            <li>Previously taught courses</li>
            <li>Notes</li>
          </ul>

          <p>
            <strong>Sheet 2:</strong>
          </p>
          <ul>
            <li>Course Codes</li>
            <li>Section</li>
            <li>Course Titles</li>
            <li>Days</li>
            <li>Times</li>
            <li>Preferred Courses</li>
            <li>Taken Courses</li>
          </ul>

          <p>
            <strong>Sheet 3:</strong>
          </p>
          <ul>
            <li>Course code + instructor</li>
            <li>Request description</li>
            <li>Request preference</li>
            <li>Response (name + note)</li>
          </ul>

          <hr />

          {previewData.file2.length > 0 ? (
            <div id="preview-container">
              <table
                className="table table-bordered table-sm"
                id="preview-table"
              >
                <tbody>
                  {previewData.file2.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No preview available. Upload a file to see a preview.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal 3 */}
      <Modal show={showModal3} onHide={() => setShowModal3(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Excel Sheet 3 Columns</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>CRN</li>
            <li>Subject Title</li>
            <li>Subject Code</li>
            <li>Course Number</li>
            <li>Section Number</li>
            <li>Course Title</li>
            <li>Days</li>
            <li>Times</li>
            <li>Start Date</li>
            <li>End Date</li>
            <li>Campus</li>
            <li>Building</li>
            <li>Room Number</li>
            <li>Instructor</li>
            <li>Max Enrollment</li>
            <li>Current Enrollment</li>
            <li>Seats Available</li>
            <li>Wait Capacity</li>
            <li>Wait Count</li>
            <li>Wait Available</li>
            <li>Section Type</li>
            <li>Available for Visiting Students</li>
            <li>Linked To</li>
          </ul>

          <hr />

          {previewData.file3.length > 0 ? (
            <div id="preview-container">
              <table
                className="table table-bordered table-sm"
                id="preview-table"
              >
                <tbody>
                  {previewData.file3.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No preview available. Upload a file to see a preview.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
