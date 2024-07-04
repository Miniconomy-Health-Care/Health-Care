import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography} from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import {getBankTransactions} from '../api/api';

const Transactions = () => {
  const columns = ['Transaction ID', 'Sender', 'Recipient', 'Reference', 'Amount in ₥', 'Date', 'Status'];
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const records = await getBankTransactions();
        const jsonBody = await records.json();
        const transactionsRecords = jsonBody.data.items;
        const formattedTransactions = transactionsRecords.map(transaction => ({
          'Transaction ID': transaction.id,
          'Sender': transaction.debitAccountName,
          'Recipient': transaction.creditAccountName,
          'Reference': transaction.reference,
          'Amount': transaction.amount,
          'Date': transaction.date,
          'Status': transaction.status,
        }));
        setTransactions(formattedTransactions);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTransactions();
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
