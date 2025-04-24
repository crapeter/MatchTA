import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

import "../CSS/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const files = ["file1.xlsx", "file2.xlsx", "file3.xlsx"];

  const handleDownloadAll = () => {
    files.forEach((fileName) => {
      const link = document.createElement("a");
      link.href = `/templates/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="home">
      <NavBar />
      <header>
        <h1>MatchTA</h1>
      </header>

      <div className="content">
        <div className="left-side-content">
          <section className="intro">
            <h2 style={{ fontWeight: "500" }}>Welcome!</h2>
            <p className="intro-text">
              MatchTA automates the assignment of Teaching Assistants (TAs) and
              Graders to courses by constructing a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Bipartite_graph"
                target="_blank"
                rel="noreferrer"
              >
                Bipartite Graph
              </a>{" "}
              and assigning edge weights based on multiple requirements. MatchTA
              will have you input data via our Excel template files, which are
              provided, upon which it will process the information to evaluate
              TA availability, preferences, and qualifications, and then assigns
              TAs to courses based on a set of predefined rules. MatchTA ensures
              that each TA's schedule, academic background, and preferences are
              considered while matching them to suitable courses. The final
              assignments are saved in an Excel file named
              <i>
                <b> Assignments.xlsx</b>
              </i>
              . This system helps streamline the TA assignment process by
              optimizing match quality and adhering to course-specific
              requirements.
            </p>

            <div className="home-buttons">
              <Button
                onClick={() => navigate("/Upload/1")}
                className="continue-button"
              >
                Click to Continue
              </Button>

              <div className="download-template-container">
                <img
                  src="/download.png"
                  alt="Download Icon"
                  className="download-image"
                  onClick={handleDownloadAll}
                />
                <Button
                  onClick={handleDownloadAll}
                  className="download-template-button"
                >
                  Download Templates
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div className="right-side-content">
          <section className="tutorial">
            <iframe
              width="800"
              height="475"
              src="https://www.youtube.com/embed/j9E6WPc8W4U"
              title="MatchTA Tutorial"
              allowFullScreen
            ></iframe>
            <p>Watch the tutorial for a walkthrough on how to use MatchTA!</p>
          </section>
        </div>
      </div>
    </div>
  );
}
