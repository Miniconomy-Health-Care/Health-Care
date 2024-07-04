import React, { useEffect, useState } from 'react';
import { Table, Box, Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TableSortLabel } from '@mui/material';

const TableTemplate = ({ columns, rows }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedRows, setSortedRows] = useState(rows);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleSearch = (event) => {
    const query = event.target.value;
    const validQuery = query.replace(/[^a-zA-Z0-9 ]/g, '');
    setSearchQuery(validQuery);

    if (validQuery === '') {
      setSortedRows(rows);
      return;
    }
    
    const filteredRows = rows.filter(row => {
      return columns.some(column => {
        const cellValue = row[column];
        return cellValue && cellValue.toString().toLowerCase().includes(validQuery.toLowerCase());
      });
    });
    setSortedRows(filteredRows);
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(column);

    const sorted = [...sortedRows].sort((a, b) => {
      if (a[column] < b[column]) {
        return isAsc ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });

    setSortedRows(sorted);
  };

  useEffect(() => {
    setSortedRows(rows);
  }, [rows]);

  return (
    <TableContainer>
      <TextField
        variant="outlined"
        placeholder="Search"
        fullWidth
        margin="normal"
        onChange={handleSearch}
        value={searchQuery}
        InputProps={{
          style: { marginBottom: '16px' },
        }}
      />
      {sortedRows.length === 0 ? (
        <Box display="flex" justifyContent="center" marginTop="1rem">
          <Typography>No Records Found</Typography>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} className="MuiTableCell-head">
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? orderDirection : 'asc'}
                    onClick={() => handleSort(column)}
                  >
                    {column}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="MuiTableRow-root">
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex} className="MuiTableCell-body">
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default TableTemplate;