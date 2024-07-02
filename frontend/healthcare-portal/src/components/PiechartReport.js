import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../pages/Home.css'

const data = [
  { name: 'Doctor Visit', value: 400 },
  { name: 'Surgery', value: 250 },
  { name: 'Medication', value: 100 },
];

const COLORS = ['#3498DB', '#E67E22', '#2ECC71'];

const PieChartReport = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartReport;
