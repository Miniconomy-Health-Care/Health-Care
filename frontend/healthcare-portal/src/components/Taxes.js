import React from 'react';
import { AppBar, Toolbar, Typography, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Link } from 'react-router-dom';
import TableTemplate from './TableTemplate'; // Path to your BasicTable component

const Taxes = () => {
  const columns = ['Tax ID', 'Tax Type ID', 'Month', 'Year', 'Amount'];

  const taxes = [
    {
      taxId: 1,
      taxTypeId: 1,
      month: 'January',
      year: 2023,
      amount: 1500,
    },
    {
      taxId: 2,
      taxTypeId: 2,
      month: 'February',
      year: 2023,
      amount: 2000,
    },
    {
        taxId: 3,
        taxTypeId: 3,
        month: 'March',
        year: 2024,
        amount: 2500,
      },
  ];

  return (
    <div>
      <h2>Taxes Table</h2>
      <TableTemplate columns={columns} rows={taxes} />
    </div>
  );
};

export default Taxes;