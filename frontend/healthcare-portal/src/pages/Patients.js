// Patients.js
import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';

const Patients = () => {
  const columns = ['Record ID', 'Personal ID', 'Date', 'Treatment Name', 'Problem', 'Cost'];

  const patients = [
    { recordId: 1, personalId: 1, date: '2023-06-01', treatmentName: 'Surgery', problem: 'Appendicitis', cost: 5000 },
    { recordId: 2, personalId: 2, date: '2023-06-10', treatmentName: 'Physical Therapy', problem: 'Back Pain', cost: 300 },
    // Add more patient records as needed
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" className="tableHeading">Patients Table</Typography>
      <Paper className="tablePaper">
        <TableTemplate columns={columns} rows={patients} />
      </Paper>
    </Container>
  );
};

export default Patients;
