import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import PieChartComponent from '../components/PiechartReport';
import BarchartReport from '../components/BarchartReport';
import './Home.css';

const pieChartData = [
  { name: 'Doctor Visit', value: 400 },
  { name: 'Surgery', value: 250 },
  { name: 'Medication', value: 100 },
];

const pieChartColors = ['#3498DB', '#E67E22', '#2ECC71'];

const barChartData = [
  { month: 'Jan', revenue: 5000 },
  { month: 'Feb', revenue: 4000 },
  { month: 'Mar', revenue: 3500 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 7000 },
  { month: 'Jul', revenue: 5500 },
  { month: 'Aug', revenue: 6500 },
  { month: 'Sep', revenue: 7200 },
  { month: 'Oct', revenue: 6900 },
  { month: 'Nov', revenue: 7300 },
  { month: 'Dec', revenue: 8000 },
];

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
                <Typography variant="h5" className="chartTitle">Monthly Revenue</Typography>
                <BarchartReport data={barChartData} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
  );
};

export default Home;
