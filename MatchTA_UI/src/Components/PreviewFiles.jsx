import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ExcelPreviewer = ({ id }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAndParseExcel = async (fileName) => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/templates/example${fileName}.xlsx`
        );
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setData(jsonData.length > 0 ? jsonData.slice(0, 2) : ["No data found"]);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    fetchAndParseExcel(id);
  }, [id]);

  return (
    <div
      className="example-container"
      style={{
        padding: "1rem",
        overflowX: "auto",
        maxWidth: "1000px",
      }}
    >
      <table border="1" cellPadding="8" style={{ marginTop: "1rem" }}>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
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
  );
};

export default ExcelPreviewer;
