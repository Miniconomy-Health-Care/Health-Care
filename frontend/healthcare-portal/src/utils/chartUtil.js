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
        <Bar dataKey="transactions" fill="#E67E22">
          {
            data.map((entry, index) => (
              <text key={`label-${index}`} fill="#000" fontSize={12} x={entry.month} y={entry.transactions + 10}>
                {entry.transactions} Ð
              </text>
            ))
          }
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarchartReport;

export const getBarChartData = (json) => {
  const data = JSON.parse(json).data.items;

  const monthlyTransactions = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
  };

  data.forEach(item => {
    const [year, month, day] = item.date.split('|');
    const fullYear = `20${year}`; // Convert YY to YYYY
    const formattedDate = `${fullYear}-${month}-${day}`;
    
    const date = new Date(formattedDate);
    const monthName = date.toLocaleString('default', { month: 'short' });

    if (item.status === "completed") {
      monthlyTransactions[monthName] += 1;
    }
  });

  const barChartData = Object.keys(monthlyTransactions).map(month => ({
    month,
    transactions: monthlyTransactions[month]
  }));

  return barChartData;
};

export const getPieChartData = (json) => {
  const data = JSON.parse(json);

  const treatmentCounts = {};

  data.forEach(item => {
    const treatmentName = item.treatmentname;
    if (treatmentCounts[treatmentName]) {
      treatmentCounts[treatmentName] += 1;
    } else {
      treatmentCounts[treatmentName] = 1;
    }
  });

  const pieChartData = Object.keys(treatmentCounts).map(name => ({
    name,
    value: treatmentCounts[name]
  }));

  return pieChartData;
};
