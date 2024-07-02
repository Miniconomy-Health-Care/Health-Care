// Stocks.js
import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';

const Stocks = () => {
  const columns = ['Stock ID', 'Stock Type', 'Date'];

  const stocks = [
    { stockId: 1, stockType: 'Bought', date: '2023-07-01' },
    { stockId: 2, stockType: 'Sold', date: '2023-08-15' },
    { stockId: 3, stockType: 'Bought', date: '2023-09-20' },
    // Add more stock records as needed
  ];

  return (
    <Container>
      <Typography variant="h4" align="center" className="tableHeading">Stocks Table</Typography>
      <Paper className="tablePaper">
        <TableTemplate columns={columns} rows={stocks} />
      </Paper>
    </Container>
  );
};

export default Stocks;
