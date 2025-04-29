import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import TAViewer from "./ViewTA";
import "../CSS/GraphComponent.css";

const GraphComponent = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const graphRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/graph-data")
      .then((res) => res.json())
      .then((data) => {
        setGraphData({
          nodes: data.nodes,
          links: data.edges,
        });

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load graph data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loading-text">Loading graph...</p>
      </div>
    );
  }

  return (
    <div className="graph-component">
      <h2 className="graph-title">TA-Course Assignments Graph</h2>
      <div className="content-container">
        <div className="view_top_tas_per_course">
          <TAViewer />
        </div>

        <div className="graph-container">
          <div className="graph-wrapper">
            {/* Graph remains unchanged regardless of selection */}
            <ForceGraph2D
              ref={graphRef}
              className="force-graph"
              graphData={graphData}
              nodeLabel="id"
              nodeAutoColorBy="group"
              linkDirectionalParticles={1}
              linkDirectionalParticleSpeed={(d) => d.weight * 0.001}
              onEngineStop={() => {
                if (graphRef.current) {
                  graphRef.current.zoomToFit(400);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;
