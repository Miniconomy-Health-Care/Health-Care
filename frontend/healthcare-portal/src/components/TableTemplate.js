import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TableSortLabel } from '@mui/material';

const TableTemplate = ({ columns, rows }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedRows, setSortedRows] = useState(rows);
  const [orderDirection, setOrderDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filteredRows = rows.filter(row => {
      return columns.some(column => {
        const cellValue = row[column.toLowerCase().replace(/ /g, '')];
        return cellValue.toString().toLowerCase().includes(event.target.value.toLowerCase());
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
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index} className="MuiTableCell-head">
                <TableSortLabel
                  active={orderBy === column.toLowerCase().replace(/ /g, '')}
                  direction={orderBy === column.toLowerCase().replace(/ /g, '') ? orderDirection : 'asc'}
                  onClick={() => handleSort(column.toLowerCase().replace(/ /g, ''))}
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
              {Object.values(row).map((value, cellIndex) => (
                <TableCell key={cellIndex} className="MuiTableCell-body">
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableTemplate;
