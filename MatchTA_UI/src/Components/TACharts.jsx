// src/components/TACharts.js
import {
    BarChart, Bar, PieChart, Pie, Cell,
    Tooltip, XAxis, YAxis, Legend, ResponsiveContainer
  } from 'recharts';
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  
  export function TAResultsChart({ taAssignments }) {
    return (
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={taAssignments}>
            <XAxis dataKey="ta" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="weight" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export function TAPieChart({ pieData }) {
    return (
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="ta"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
  