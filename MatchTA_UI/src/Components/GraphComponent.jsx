import React, { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";

const GraphComponent = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/graph-data")
      .then((res) => res.json())
      .then((data) => {
        setGraphData({
          nodes: data.nodes,
          links: data.edges, // Mapping backend 'edges' to frontend 'links'
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load graph data", err);
        setIsLoading(false);
      });
  }, []);

  const handleSelectChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredLinks = selectedCourse
    ? graphData.links.filter((link) => link.target === selectedCourse)
    : graphData.links;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <div className="loader"></div>
        <p>Loading graph...</p>
        <style>{`
          .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #007bff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <h2>TA-Course Assignments Graph</h2>
      <label htmlFor="courseSelect">Select a course:</label>
      <select id="courseSelect" onChange={handleSelectChange}>
        <option value="">All Courses</option>
        {graphData.nodes
          .filter((node) => node.group === 1) // group 1 = courses
          .map((course) => (
            <option key={course.id} value={course.id}>
              {course.id}
            </option>
          ))}
      </select>

      <div style={{ height: "600px", marginTop: "20px", position: "relative", zIndex: 0 }}>
  <ForceGraph2D
    graphData={{
      nodes: graphData.nodes,
      links: filteredLinks,
    }}
    nodeLabel="id"
    nodeAutoColorBy="group"
    linkDirectionalParticles={1}
    linkDirectionalParticleSpeed={(d) => d.weight * 0.001}
  />
</div>

    </div>
  );
};

export default GraphComponent;
