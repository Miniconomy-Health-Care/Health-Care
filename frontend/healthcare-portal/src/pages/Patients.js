import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';

const Patients = () => {
  const columns = ['Record ID', 'Personal ID', 'Date', 'Treatment Name', 'Problem', 'Cost'];

  const patients = [
    { recordid: 1, personalid: 1, date: '2023-06-01', treatmentname: 'Surgery', problem: 'Appendicitis', cost: 5000 },
    { recordid: 2, personalid: 2, date: '2023-06-10', treatmentname: 'Physical Therapy', problem: 'Back Pain', cost: 300 },
    // Add more patient records as needed
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" className="tableHeading">Personas Table</Typography>
      <Paper className="tablePaper">
        <TableTemplate columns={columns} rows={patients} />
      </Paper>
    </Container>
  );
};

export default Patients;