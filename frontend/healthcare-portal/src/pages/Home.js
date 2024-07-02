import React from 'react';
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

const Home = () => {
  return (
    <div className="root">
      <main className="content">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card persona">
                <Box>
                  <Typography variant="h5" className="cardTitle">Personas</Typography>
                  <Typography variant="h3">249</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card stock">
                <Box>
                  <Typography variant="h5" className="cardTitle">Stocks</Typography>
                  <Typography variant="h3">25</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card tax">
                <Box>
                  <Typography variant="h5" className="cardTitle">Taxes</Typography>
                  <Typography variant="h3">150</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card revenue">
                <Box>
                  <Typography variant="h5" className="cardTitle">Revenue</Typography>
                  <Typography variant="h3">56</Typography>
                </Box>
              </Paper>
            </Grid>
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
        </Container>
      </main>
    </div>
  );
};

export default Home;
