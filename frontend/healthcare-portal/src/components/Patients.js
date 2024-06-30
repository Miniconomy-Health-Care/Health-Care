import React from 'react';
import TableTemplate from './TableTemplate'; // Path to your BasicTable component

const Patients = () => {
  const columns = ['Record ID', 'Personal ID', 'Date', 'Treatment Name', 'Problem', 'Cost'];
  
  const patients = [
    {
      recordId: 1,
      personalId: 1,
      date: '2023-06-01',
      treatmentName: 'Surgery',
      problem: 'Appendicitis',
      cost: 5000,
    },
    {
      recordId: 2,
      personalId: 2,
      date: '2023-06-10',
      treatmentName: 'Physical Therapy',
      problem: 'Back Pain',
      cost: 300,
    },
  ];

  return (
    <div>
      <h2>Patients Table</h2>
      <TableTemplate columns={columns} rows={patients} />
    </div>
  );
};

export default Patients;