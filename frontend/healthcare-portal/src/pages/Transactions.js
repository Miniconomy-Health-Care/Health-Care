import React, { useEffect, useState }  from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import { getTransactionRecords } from '../api/api';
const Transactions = () => {
  const columns = ['ID','Debit Account Name','Credit Account Name','Reference','Amount','Date','Status'];
  const [transactions,setTransactions] = useState([]);

  useEffect(() => {
    const sampleJson = `[
    { "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6","debitAccountName": "string","creditAccountName": "string","reference": "string","amount": 0,"date": "string","status": "failed"}]`;

    const transactionsRecords = JSON.parse(sampleJson);

    const formattedTransactions = transactionsRecords.map(transaction => ({
      'ID' : transaction.transactionId,
      'Debit Account Name' : transaction.debitAccountName,
      'Credit Account Name' : transaction.creditAccountName,
      'Reference' : transaction.reference,
      'Amount' : transaction.amount,
      'Date' : transaction.date,
      'Status' : transaction.status,
    }));

    setTransactions(formattedTransactions);

    //Remove the code above once you make sure getTransactionRecords() works when the actual API is ready
    getTransactionRecords()
      .then((records) => {
        const formattedTransactions = records.map(transaction => ({
          'ID' : transaction.transactionId,
          'Debit Account Name' : transaction.debitAccountName,
          'Credit Account Name' : transaction.creditAccountName,
          'Reference' : transaction.reference,
          'Amount' : transaction.amount,
          'Date' : transaction.date,
          'Status' : transaction.status,
        }));
        setTransactions(formattedTransactions);
      })
      .catch((err) => console.log(err));
    }, []);


  return (
    <Container>
      <Paper className="tablePaper">
        <Typography variant="h4" align="center" className="tableHeading">Transactions Table</Typography>
        <TableTemplate columns={columns} rows={transactions} />
      </Paper>
    </Container>
  );
};

export default Transactions;
