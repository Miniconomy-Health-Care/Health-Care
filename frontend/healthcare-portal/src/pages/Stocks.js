import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';

const Stocks = () => {
  const columns = ['Stock ID', 'Stock Type', 'Date'];

  const stocks = [
    { stockid: 1, stocktype: 'Bought', date: '2023-07-01' },
    { stockid: 2, stocktype: 'Sold', date: '2023-08-15' },
    { stockid: 3, stocktype: 'Bought', date: '2023-09-20' },
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