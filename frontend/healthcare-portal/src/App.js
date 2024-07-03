import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Patients from './pages/Patients';
import Taxes from './pages/Taxes';
import Stocks from './pages/Stocks';
import DrawerTemplate from './components/DrawerTemplate';
import './pages/Home.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(true);
  }, [location]);

  return (
    <div className="root">
      <CssBaseline />
      <DrawerTemplate />
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Patients" element={isAuthenticated ? <Patients /> : <Navigate to="/Home" />} />
          <Route path="/Taxes" element={isAuthenticated ? <Taxes /> : <Navigate to="/Home" />} />
          <Route path="/Stocks" element={isAuthenticated ? <Stocks /> : <Navigate to="/Home" />} />
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
