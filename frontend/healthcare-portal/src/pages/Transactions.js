import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import TableTemplate from '../components/TableTemplate';
import { getBankTransactions } from '../api/api';

const Transactions = () => {
  const columns = ['Transaction ID', 'Sender', 'Recipient', 'Reference', 'Amount in ₥', 'Date', 'Status'];
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const sampleJson = `{
      "status": 0,
      "data": {
        "pageIndex": 0,
        "itemsPerPage": 0,
        "currentItemCount": 0,
        "items": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "debitAccountName": "health-insurance",
            "creditAccountName": "health-care",
            "reference": "7",
            "amount": 1024,
            "date": "24|06|15",
            "status": "completed"
          },
          {
            "id": "4bb85f64-6717-4562-b3fc-3d963f77bfa7",
            "debitAccountName": "health-insurance",
            "creditAccountName": "health-care",
            "reference": "1",
            "amount": 2024,
            "date": "24|06|16",
            "status": "pending"
          },
          {
            "id": "5cc95f64-7717-4562-b3fc-4e963f88cfa8",
            "debitAccountName": "health-care",
            "creditAccountName": "central-revenue",
            "reference": "VAT",
            "amount": 5120,
            "date": "24|06|17",
            "status": "failed"
          },
          {
            "id": "6dd95f64-8717-4562-b3fc-5f963f99dfa9",
            "debitAccountName": "stock-exchange",
            "creditAccountName": "health-care",
            "reference": "dividends",
            "amount": 2048,
            "date": "24|05|18",
            "status": "completed"
          },
          {
            "id": "7ee95f64-9717-4562-b3fc-6g963fa1efa0",
            "debitAccountName": "health-care",
            "creditAccountName": "central-revenue",
            "reference": "Income Tax",
            "amount": 9216,
            "date": "24|06|19",
            "status": "completed"
          }
        ]
      },
      "message": "string"
    }`;

    const parsedJson = JSON.parse(sampleJson);
    const transactionsRecords = parsedJson.data.items;

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

    //Remove all code above once in this useEffect once you make sure getTransactionRecords() works when the API is ready
    // I have tried to plan for call failure, I just hope the table is empty on the respective page
    const fetchTransactions = async () => {
      try {
        const records = await getBankTransactions();
        const transactionsRecords = records.data.items;
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