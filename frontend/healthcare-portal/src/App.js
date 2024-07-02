import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import '../src/pages/Home.css';
import Home from './pages/Home';
import Patients from './pages/Patients';
import Taxes from './pages/Taxes';
import Stocks from './pages/Stocks';
import DrawerTemplate from './components/DrawerTemplate';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    alert("Logged out successfully!");
  };

  return (
    <div className="root">
      <DrawerTemplate />
      <main className="content">
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Patients" element={isAuthenticated ? <Patients /> : <Navigate to="/Home" />} />
          <Route path="/Taxes" element={<Taxes />} />
          <Route path="/Stocks" element={<Stocks />} />
          <Route path="/" element={<Home />} />
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
