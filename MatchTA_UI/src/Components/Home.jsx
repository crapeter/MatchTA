import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

import "../CSS/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const files = [
    "/templates/file1.xlsx",
    "/templates/file2.xlsx",
    "/templates/file3.xlsx",
  ];

  const downloadFiles = () => {
    files.forEach((file) => {
      const link = document.createElement("a");
      link.href = file;
      link.download = file.split("/").pop(); // Extract filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="home">
      <NavBar />
      <header className="home-header">
        <img
          src="/Texas_Tech_Logo.png"
          alt="Texas Tech Logo"
          className="texas-tech-logo"
        />
        <h1 className="title">MatchTa</h1>
      </header>

      <div className="content">
        <div className="left-side-content">
          <section className="intro">
            <h2>Welcome!</h2>
            <p>
              MatchTA automates the assignment of Teaching Assistants (TAs) to
              courses using advanced algorithms. MatchTA will have you input
              data via our Excel template files, which are provided, upon which
              it will process the information to evaluate TA availability,
              preferences, and qualifications, and then assigns TAs to courses
              based on a set of predefined rules. MatchTA ensures that each TA's
              schedule, academic background, and preferences are considered
              while matching them to suitable courses. The final assignments are
              saved in an Excel file named "Capstone_Project.xlsx". This system
              helps streamline the TA assignment process by optimizing match
              quality and adhering to course-specific requirements.
            </p>

            <div className="home-buttons">
              <div className="download-template-container">
                <img
                  src="/download.png"
                  alt="Download Icon"
                  className="download-image"
                  onClick={downloadFiles}
                />
                <Button
                  onClick={downloadFiles}
                  className="download-template-button"
                  variant="primary"
                >
                  Download Templates
                </Button>
              </div>

              <Button
                onClick={() => navigate("/Upload/1")}
                className="continue-button"
                variant="danger"
              >
                Click to Continue
              </Button>
            </div>
          </section>
        </div>

        <div className="right-side-content">
          <section className="tutorial">
            <iframe
              width="1000"
              height="500"
              src="https://www.youtube.com/embed/j9E6WPc8W4U"
              title="MatchTA Tutorial"
              className="tutorial-video"
              allowFullScreen
            ></iframe>
            <p>Watch the tutorial to understand how to use the app!</p>
          </section>
        </div>
      </div>
    </div>
  );
}
