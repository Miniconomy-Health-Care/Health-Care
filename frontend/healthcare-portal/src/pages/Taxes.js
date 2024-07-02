// Taxes.js
import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';

const Taxes = () => {
  const columns = ['Tax ID', 'Tax Type ID', 'Month', 'Year', 'Amount'];

  const taxes = [
    { taxId: 1, taxTypeId: 1, month: 'January', year: 2023, amount: 1500 },
    { taxId: 2, taxTypeId: 2, month: 'February', year: 2023, amount: 2000 },
    { taxId: 3, taxTypeId: 3, month: 'March', year: 2024, amount: 2500 },
    // Add more tax records as needed
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" className="tableHeading">Taxes Table</Typography>
      <Paper className="tablePaper">
        <TableTemplate columns={columns} rows={taxes} />
      </Paper>
    </Container>
  );
};

export default Taxes;
