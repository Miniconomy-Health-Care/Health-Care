import React, {useEffect, useState} from 'react';
import {
  AppBar,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import {Link, Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {Category, Dashboard, Search} from '@mui/icons-material';
import './App.css';

import Cookies from "js-cookie";

import Home from './components/Home';
import Patients from './components/Patients';
import Taxes from './components/Taxes';
import Stocks from './components/Stocks';

const App = () => {
  
  const[isAutheticated, setisAutheticated] = useState(false);
  const location = useLocation();

  function logout(){
    Cookies.remove('jwt');
    setisAutheticated(false);
    window.location.reload()
  }

  useEffect(() => {
    setisAutheticated(true);
  }, [location]);

  const drawerItems = [
    { text: 'Dashboard', icon: <Dashboard />, route: '/Home' },
    { text: 'Personas', icon: <Category />, route: '/Patients' }, // Link to Patients.js renamed to Personas
    { text: 'Taxes', icon: <Category />, route: '/Taxes' }, // Link to Taxes.js
    { text: 'Stocks', icon: <Category />, route: '/Stocks' }, // Link to Stocks.js
  ];

  return (
    <div>
      {/* Search Bar */}
      <AppBar position="fixed" className="appBar">
        <Toolbar>
          <Typography variant="h6" className="title">
            Healthcare Admin Portal
          </Typography>
          <div className="search">
            <div className="searchIcon">
              <IconButton>
                <Search />
              </IconButton>
            </div>
            <InputBase
              placeholder="Search..."
              classes={{
                root: 'inputRoot',
                input: 'inputInput',
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        classes={{
          paper: 'drawerPaper',
        }}
      >
        <div className="toolbar">
          <Typography variant="h6" className="drawerTitle">
            
          </Typography>
        </div>

        <div>
          <button onClick={logout}>Logout</button>
        </div>
        
        <List>
          {drawerItems.map((item, index) => (
            <ListItem button key={item.text} component={Link} to={item.route}>
              <ListItemIcon style={{ color: '#fff' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <main className="content">
        <div className="toolbar" />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace/>}/>
          <Route path="/Home" element={<Home />} />
          <Route path="/Patients" element={ isAutheticated ? <Patients/> : <Navigate to="/Home" /> } />
          <Route path="/Taxes" element={ isAutheticated ? <Taxes/> : <Navigate to="/Home" /> }  />
          <Route path="/Stocks" element={ isAutheticated ? <Stocks/> : <Navigate to="/Home" /> }  />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function NotFound() {
  return <div><h1>404 - Not Found</h1></div>;
}

export default App;
