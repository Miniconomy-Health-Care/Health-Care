import React, {useEffect, useState} from 'react';
import {Box, Grid, Paper, Typography} from '@mui/material';
import PieChartComponent from '../components/PiechartReport';
import BarchartReport from '../components/BarchartReport';
import {getBarChartData, getPieChartData} from '../utils/chartUtil'
import './Home.css';
import {getBankBalance, getBankTransactions, getPersonaRecords, getTaxRecords} from "../api/api";

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
  {css: "card persona", colour: {backgroundColor: "#3498DB"}, title: "Persona admissions", count: 0},
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
      const patientJson = await getPersonaRecords();
      const taxJson = await getTaxRecords();
      const bankBalanceJson = await getBankBalance();
      const transactionJson = await getBankTransactions();


      const taxRecordsParsed = await taxJson.json();
      const patientRecordsParsed = await patientJson.json();
      const parsedTransactionJson = await transactionJson.json();
      const parsedBankBalanceJson = await bankBalanceJson.json();
      
      const taxRecords = taxRecordsParsed ? taxRecordsParsed : [];
      const patientRecords = patientRecordsParsed ? patientRecordsParsed : [];
      const transactionsRecords = parsedTransactionJson?.data?.items || [];
      
      const taxRecordCount = taxRecords.length;
      const patientRecordCount = patientRecords.length;
      const transactionRecordCount = transactionsRecords.length;
      const accountBalance = parsedBankBalanceJson?.data?.accountBalance ?? "-";

      const countArray = [patientRecordCount, transactionRecordCount, taxRecordCount, accountBalance];

      const updatedStyleArray = styleArray.map((style, index) => ({
        ...style,
        count: countArray[index],
      }));

      setStyleArray(updatedStyleArray);
      if (parsedTransactionJson) {
        setBarChartData(JSON.stringify(parsedTransactionJson));
      }
      if (patientRecordsParsed) {
        setPieChartData(JSON.stringify(patientRecordsParsed));
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
