import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import "../CSS/ViewTA.css";

const ViewTA = () => {
  const [finalRows, setFinalRows] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const fileData = sessionStorage.getItem("capstoneBlob");
    if (fileData) {
      const byteArray = new Uint8Array(JSON.parse(fileData));
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setFinalRows(json);

        // Extract unique courses - using Object.keys to find the correct column names
        const firstRow = json[0] || {};
        const courseColumn = Object.keys(firstRow).find(
          (key) =>
            key.toLowerCase().includes("course") &&
            !key.toLowerCase().includes("section")
        );
        const sectionColumn = Object.keys(firstRow).find((key) =>
          key.toLowerCase().includes("section")
        );

        if (courseColumn && sectionColumn) {
          const courses = [
            ...new Set(
              json.map((row) => `${row[courseColumn]}-${row[sectionColumn]}`)
            ),
          ];
          setUniqueCourses(courses);

          if (courses.length > 0) {
            setSelectedCourse(courses[0]);
          }
        }
      };
      reader.readAsArrayBuffer(blob);
    } else {
      console.error("No capstoneBlob found in sessionStorage.");
    }
  }, []);

  useEffect(() => {
    if (selectedCourse && finalRows.length > 0) {
      const firstRow = finalRows[0] || {};
      const courseColumn = Object.keys(firstRow).find(
        (key) =>
          key.toLowerCase().includes("course") &&
          !key.toLowerCase().includes("section")
      );
      const sectionColumn = Object.keys(firstRow).find((key) =>
        key.toLowerCase().includes("section")
      );
      const instructorColumn = Object.keys(firstRow).find((key) =>
        key.toLowerCase().includes("instructor")
      );
      const assignmentColumn = Object.keys(firstRow).find((key) =>
        key.toLowerCase().includes("assignment")
      );

      if (courseColumn && sectionColumn) {
        const [courseNum, sectionNum] = selectedCourse.split("-");
        const filtered = finalRows
          .filter(
            (row) =>
              String(row[courseColumn]) === courseNum &&
              String(row[sectionColumn]) === sectionNum
          )
          .map((row) => ({
            course: row[courseColumn],
            section: row[sectionColumn],
            instructor: instructorColumn ? row[instructorColumn] : "N/A",
            assignment: assignmentColumn ? row[assignmentColumn] : "N/A",
          }));
        setFilteredResults(filtered);
      }
    }
  }, [selectedCourse, finalRows]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  return (
    <div className="ViewTA" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>TA Assignment Results</h2>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="course-select"
          style={{ marginRight: "10px", fontWeight: "bold" }}
        >
          Select Course:
        </label>
        <select
          id="course-select"
          value={selectedCourse}
          onChange={handleCourseChange}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            minWidth: "200px",
          }}
        >
          {uniqueCourses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {selectedCourse && (
        <div>
          <h3 style={{ marginBottom: "15px" }}>
            TA Assignments for {selectedCourse}
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1.5rem",
            }}
            className="table"
          >
            <thead className="table-header">
              <tr style={{ backgroundColor: "#f0f0f0" }} className="table-row">
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
            <tbody className="table-body">
              {filteredResults.map((row, index) => (
                <tr key={index} className="table-row">
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {row.course}-{row.section}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {row.instructor}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                    {row.assignment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewTA;
