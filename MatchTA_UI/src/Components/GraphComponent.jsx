// src/components/GraphComponent.js
import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphComponent({ graphData }) {
  return (
    <div style={{ height: '400px' }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.3}
      />
    </div>
  );
}
