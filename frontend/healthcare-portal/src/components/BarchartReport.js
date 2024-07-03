import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import '../pages/Home.css';

const BarchartReport = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
        <Legend />
        <Bar dataKey="revenue" fill="#E67E22">
          {
            data.map((entry, index) => (
              <text key={`label-${index}`} fill="#000" fontSize={12} x={entry.month} y={entry.revenue + 10}>
                {entry.revenue} USD
              </text>
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarchartReport;
