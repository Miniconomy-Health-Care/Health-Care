import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TableSortLabel, Box
} from '@mui/material';
import '../pages/Home.css'

const TableTemplate = ({ columns, rows }) => {
  const [searchText, setSearchText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredRows = rows.filter((row) =>{
    //console.log( row[columns[0].toLowerCase().replace(/ /g, '')])
    //console.log(row['recordId']);
    columns.some((column) => row[column.toLowerCase().replace(/ /g, '')].toString().toLowerCase().includes(searchText.toLowerCase()))
  }
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortConfig.key === null) {
      return 0;
    }
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <Box>
      <TextField
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  <TableSortLabel
                    active={sortConfig.key === column.toLowerCase().replace(/ /g, '')}
                    direction={sortConfig.key === column.toLowerCase().replace(/ /g, '') ? sortConfig.direction : 'asc'}
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
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>{row[column.toLowerCase().replace(/ /g, '')]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableTemplate;
