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

const sampleJson = `{
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
      },
      {
        "id": "4bb85f64-6717-4562-b3fc-3d963f77bfa7",
        "debitAccountName": "health_insurance",
        "creditAccountName": "health_care",
        "reference": "1",
        "amount": 2024,
        "date": "24|06|16",
        "status": "pending"
      },
      {
        "id": "5cc95f64-7717-4562-b3fc-4e963f88cfa8",
        "debitAccountName": "health_care",
        "creditAccountName": "central_revenue",
        "reference": "VAT",
        "amount": 5120,
        "date": "24|06|17",
        "status": "failed"
      },
      {
        "id": "6dd95f64-8717-4562-b3fc-5f963f99dfa9",
        "debitAccountName": "stock_exchange",
        "creditAccountName": "health_care",
        "reference": "dividends",
        "amount": 2048,
        "date": "24|05|18",
        "status": "completed"
      },
      {
        "id": "7ee95f64-9717-4562-b3fc-6g963fa1efa0",
        "debitAccountName": "health_care",
        "creditAccountName": "central_revenue",
        "reference": "Income Tax",
        "amount": 9216,
        "date": "24|06|19",
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

 const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const [styleArray, setStyleArray] = useState(initialStyleArray);

  useEffect(() => {

    const numPersona = getRandomInt(10, 20);
    const numStocks = getRandomInt(10, 20);
    const numTax = getRandomInt(10, 20);
    const numRevenue = getRandomInt(10, 20);

    const countArray = [numPersona, numStocks, numTax, numRevenue];

    const updatedStyleArray = styleArray.map((style, index) => ({
      ...style,
      count: countArray[index],
    }));

    setStyleArray(updatedStyleArray);
  },[])

  const barChartData = getBarChartData(sampleJson);
  const pieChartData = getPieChartData(samplePieJson);
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
