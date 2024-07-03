import React from 'react';
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Dashboard, Category } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import '../pages/Home.css'; // Adjust the path as necessary

import Cookies from "js-cookie";

const DrawerTemplate = () => {

  function logout(){
    Cookies.remove('jwt');
    window.location.reload()
  }

  const drawerItems = [
    { text: 'Dashboard', icon: <Dashboard />, route: '/Home' },
    { text: 'Personas', icon: <Category />, route: '/Patients' },
    { text: 'Taxes', icon: <Category />, route: '/Taxes' },
    { text: 'Stocks', icon: <Category />, route: '/Stocks' },
  ];

  return (
    <Drawer variant="permanent" classes={{ paper: 'drawerPaper' }}>
      <div className="toolbar">
        <Typography variant="h6" className="drawerTitle" align='center'>
          Health Care Portal
        </Typography>
      </div>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem button key={item.text} component={Link} to={item.route}>
            <ListItemIcon style={{ color: '#2C3E50' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} style={{ color: '#2C3E50' }} />
          </ListItem>
        ))}
        <ListItem button key={'Logout'} onClick={() => logout()}>
            <ListItemIcon style={{ color: '#2C3E50' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Logout'} style={{ color: '#2C3E50' }} />
          </ListItem>
      </List>
    </Drawer>
  );
};

export default DrawerTemplate;
