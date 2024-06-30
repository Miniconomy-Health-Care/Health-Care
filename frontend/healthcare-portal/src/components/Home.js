import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Grid, Paper, Box } from '@mui/material';
import './Home.css';

const Home = () => {
  return (
    <div className="root">
      <AppBar position="fixed" className="appBar">
        <Toolbar>
          <Typography variant="h6" className="title">
            Healthcare Admin Portal
          </Typography>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        </Toolbar>
      </AppBar>
      <main className="content">
        <div className="toolbar" />
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card products">
                <Box>
                  <Typography variant="h5">Products</Typography>
                  <Typography variant="h3">249</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card categories">
                <Box>
                  <Typography variant="h5">Categories</Typography>
                  <Typography variant="h3">25</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card customers">
                <Box>
                  <Typography variant="h5">Customers</Typography>
                  <Typography variant="h3">1500</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="card alerts">
                <Box>
                  <Typography variant="h5">Alerts</Typography>
                  <Typography variant="h3">56</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Home;