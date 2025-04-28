import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import PreviewFile from "./PreviewFiles";
import * as XLSX from "xlsx";

export default function UploadPage() {
  const { id } = useParams();
  const sheetNumber = parseInt(id);
  const nav = useNavigate();

  const [step, setStep] = useState("upload"); // "upload" | "preview" | "loading" | "done"
  const [previewData, setPreviewData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0); // Progress state for the progress bar

  const explanations = {
    1: "Sheet 1: Contains TA applicant names, advisors, and course preferences.",
    2: "Sheet 2: Contains TA availability, enrolled classes, and preference rankings.",
    3: "Sheet 3: Contains course catalog info — titles, instructors, room/times, etc.",
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setPreviewData(json.slice(0, 10)); // show first 10 rows
      setStep("preview");
      sessionStorage.setItem(
        `sheet${sheetNumber}`,
        JSON.stringify(Array.from(new Uint8Array(data)))
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleContinue = async () => {
    if (sheetNumber < 3) {
      setStep("upload");
      setPreviewData([]);
      setFileName("");
      nav(`/Upload/${sheetNumber + 1}`);
    } else {
      // Show progress bar and start generating results
      setStep("loading");
      setProgress(0);

      try {
        const formData = new FormData();
        for (let i = 1; i <= 3; i++) {
          const byteArray = new Uint8Array(
            JSON.parse(sessionStorage.getItem(`sheet${i}`))
          );
          const blob = new Blob([byteArray], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          formData.append("file", blob, `sheet${i}.xlsx`);
        }
        formData.append("num_of_tas", 25); // adjustable

        // Simulate progress updates
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 500);

        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const blob = await res.blob();
        sessionStorage.setItem(
          "capstoneBlob",
          JSON.stringify(Array.from(new Uint8Array(await blob.arrayBuffer())))
        );

        // Complete progress and navigate to results
        setProgress(100);
        setTimeout(() => nav("/Results"), 500);
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong during upload.");
        setStep("upload");
        setProgress(0);
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <NavBar />
      <h2>Upload Sheet {sheetNumber}</h2>

      <PreviewFile id={sheetNumber} />

      {step === "upload" && (
        <>
          <p style={{ marginBottom: "1rem" }}>{explanations[sheetNumber]}</p>
          <input type="file" accept=".xlsx" onChange={handleUpload} />
        </>
      )}

      {step === "preview" && (
        <>
          <p>
            <strong>{fileName}</strong> uploaded. Preview below:
          </p>
          <div
            style={{
              overflowX: "auto",
              marginTop: "1rem",
              border: "1px solid #ccc",
              maxHeight: "300px",
            }}
          >
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                {previewData.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        style={{
                          border: "1px solid #ccc",
                          padding: "4px",
                          fontSize: "14px",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button style={{ marginTop: "1.5rem" }} onClick={handleContinue}>
            {sheetNumber === 3 ? "Generate Assignments" : "Continue"}
          </button>
        </>
      )}

      {step === "loading" && (
        <>
          <p>Generating results... Please wait.</p>
          <div
            style={{
              width: "100%",
              backgroundColor: "#f3f3f3",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "20px",
                backgroundColor: "#007bff",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>
          <p>{progress}%</p>
        </>
      )}
    </div>
  );
}
