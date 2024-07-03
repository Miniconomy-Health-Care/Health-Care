import React, { useState } from "react";
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Dashboard, Category, Menu } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme, useMediaQuery } from "@mui/material";
import Cookies from "js-cookie";
import '../pages/Home.css'; // Adjust the path as necessary

const DrawerTemplate = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    Cookies.remove("jwt");
    window.location.reload();
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <Dashboard />, route: '/Home' },
    { text: 'Personas', icon: <Category />, route: '/Patients' },
    { text: 'Taxes', icon: <Category />, route: '/Taxes' },
    { text: 'Transactions', icon: <Category />, route: '/Transactions' },
  ];

  const drawerContent = (
    <div>
      <div className="toolbar">
        <Typography variant="h6" className="drawerTitle" align="center">
          Health Care Portal
        </Typography>
      </div>
      <List>
        {drawerItems.map((item, index) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.route}
            onClick={handleDrawerToggle}
          >
            <ListItemIcon style={{ color: "#2C3E50" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} style={{ color: "#2C3E50" }} />
          </ListItem>
        ))}
        <ListItem button key={"Logout"} onClick={logout}>
          <ListItemIcon style={{ color: "#2C3E50" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Logout"} style={{ color: "#2C3E50" }} />
        </ListItem>
      </List>
    </div>
  );

  const iconButtonStyle = { alignSelf: "start" };

  const drawerStyle = {
    width: "7rem",
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: "15rem",
      boxSizing: "border-box",
    },
  };

  return (
    <>
      {isMobile && (
        <IconButton
          sx={iconButtonStyle}
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className="menuButton"
        >
          <Menu />
        </IconButton>
      )}
      <Stack flexDirection={"column"} alignItems={"start"}>
        <Drawer
          sx={drawerStyle}
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          classes={{ paper: "drawerPaper" }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>
      </Stack>
    </>
  );
};

export default DrawerTemplate;
