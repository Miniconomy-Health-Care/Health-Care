import React, { useEffect, useState } from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import PieChartComponent from '../components/PiechartReport';
import BarchartReport from '../components/BarchartReport';
import { getBarChartData, getPieChartData } from '../utils/chartUtil'
import './Home.css';

const samplePieJson = `[
  {"personaid":"6","isadmitted":true,"recordid":1,"date":"01|02|03","treatmentname":"Doctor Visit","problem":"Sickness","treatmentcost":409600},
  {"personaid":"8","isadmitted":true,"recordid":2,"date":"01|02|03","treatmentname":"Medication","problem":"Prescription","treatmentcost":2044800},
  {"personaid":"5","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Medication","problem":"Prescription","treatmentcost":2044800},
  {"personaid":"3","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800},
  {"personaid":"1","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800}
]`;

const pieChartColors = ['#3498DB', '#E67E22', '#2ECC71'];

const sampleBarJson = `{
  "status": 0,
  "data": {
    "pageIndex": 0,
    "itemsPerPage": 0,
    "currentItemCount": 0,
    "items": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "debitAccountName": "health_insurance",
        "creditAccountName": "health_care",
        "reference": "7",
        "amount": 1024,
        "date": "24|06|15",
        "status": "completed"
      }
    ]
  },
  "message": "string"
}`;

const initialStyleArray = [
  { css: "card persona", colour: {backgroundColor : "#3498DB"} , title: "Personas", count: 0 },
  { css: "card transactions", colour: {backgroundColor : "#E67E22"}, title: "Transactions", count: 0  }, 
  { css: "card tax", colour: {backgroundColor : "#2ECC71"}, title: "Taxes", count: 0}, 
  { css: "card bankBalance", colour: {backgroundColor : "#E74C3C"}, title: "Bank Balance", count: 0 },
]


const Home = () => {

  const [styleArray, setStyleArray] = useState(initialStyleArray);
  const [pieChartDataJSON, setPieChartData] = useState(samplePieJson);
  const [barChartDataJSON, setBarChartData] = useState(sampleBarJson);

  

  useEffect(() => {
    async function fetchData() {
      const taxJson = `[
        {"taxid":1,"name":"VAT","month":"06","year":"24","amount":"1024"},
        {"taxid":2,"name":"Income","month":"03","year":"23","amount":"2048"},
        {"taxid":3,"name":"VAT","month":"12","year":"24","amount":"3072"},
        {"taxid":4,"name":"Income","month":"09","year":"22","amount":"4096"},
        {"taxid":5,"name":"VAT","month":"01","year":"25","amount":"5120"},
        {"taxid":6,"name":"Income","month":"04","year":"24","amount":"6144"},
        {"taxid":7,"name":"VAT","month":"08","year":"23","amount":"7168"},
        {"taxid":8,"name":"Income","month":"07","year":"25","amount":"8192"}
      ]`;

      const patientJson = `[
        {"personaid":"6","isadmitted":true,"recordid":1,"date":"01|02|03","treatmentname":"Doctor Visit","problem":"Sickness","treatmentcost":409600},
        {"personaid":"8","isadmitted":true,"recordid":2,"date":"01|02|03","treatmentname":"Medication","problem":"Prescription","treatmentcost":2044800},
        {"personaid":"5","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Medication","problem":"Prescription","treatmentcost":2044800},
        {"personaid":"3","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800},
        {"personaid":"1","isadmitted":true,"recordid":3,"date":"01|02|03","treatmentname":"Surgery","problem":"Prescription","treatmentcost":2044800}
      ]`;

      const transactionJson = `{
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
              "amount": 100.50,
              "date": "24|06|15",
              "status": "completed"
            },
            {
              "id": "4bb85f64-6717-4562-b3fc-3d963f77bfa7",
              "debitAccountName": "health-insurance",
              "creditAccountName": "health-care",
              "reference": "1",
              "amount": 200.00,
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

      const bankBalanceJson = `{
        "status": 0,
        "data": {
          "accountName": "Savings Account",
          "accountBalance": 18432
        },
        "message": "Success"
      }`;

      // remove just the above fake json code IN THIS FUNCTION and then uncomment this code once these api function calls work -- DO NOT REMOVE sampleBarJson and samplePieJson at the top
      // I have tried to make conditions for failures, I just hope the counts are 0 and the graphs show fake sample data
      /*
      const patientJson = await getPersonaRecords();
      const taxJson = await getTaxRecords();
      const bankBalanceJson = await getBankBalance();
      const transactionJson = await getBankTransactions();
      */
      
      const taxRecordsParsed = JSON.parse(taxJson);
      const patientRecordsParsed = JSON.parse(patientJson);
      const parsedTransactionJson= JSON.parse(transactionJson);
      const parsedBankBalanceJson = JSON.parse(bankBalanceJson);
      
      const taxRecords = taxRecordsParsed ? taxRecordsParsed : [];
      const patientRecords = patientRecordsParsed ? patientRecordsParsed : [];
      const transactionsRecords = parsedTransactionJson?.data?.items || [];
      
      const taxRecordCount = taxRecords.length;
      const patientRecordCount = patientRecords.length;
      const transactionRecordCount = transactionsRecords.length;
      const accountBalance = parsedBankBalanceJson?.data?.accountBalance || "Account Balance Unavailable";

      const countArray = [patientRecordCount, transactionRecordCount, taxRecordCount, accountBalance];

      const updatedStyleArray = styleArray.map((style, index) => ({
        ...style,
        count: countArray[index],
      }));

      setStyleArray(updatedStyleArray);
      if(patientRecordsParsed){
        setBarChartData(transactionJson);
      }
      if(parsedTransactionJson){
        setPieChartData(patientJson);
      }
    
    }

    fetchData();
  }, []);
  
   const barChartData = getBarChartData(barChartDataJSON);
   const pieChartData = getPieChartData(pieChartDataJSON);

  return (
        <Box marginLeft="7rem" padding = "1.75rem">
          <Grid container spacing={3}>
            {/* Cards */}
            {styleArray.map((style, index) => (
                <Grid item xs={12} sm={6} md={3}>
                  <Paper className={style.css} sx = {style.colour} >
                    <Box>
                      <Typography variant="h5" className="cardTitle">{style.title}</Typography>
                      <Typography variant="h3">{style.count}</Typography>
                    </Box>
                  </Paper>
                </Grid>
            ))}
            {/* Pie Chart and Bar Chart */}
            <Grid item xs={12} md={6}>
              <Paper className="pieChartPaper">
                <Typography variant="h5" className="chartTitle">Total Treatments</Typography>
                <PieChartComponent data={pieChartData} colors={pieChartColors} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className="barChartPaper">
                <Typography variant="h5" className="chartTitle">Transactions per Month</Typography>
                <BarchartReport data={barChartData} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
  );
};

export default Home;
