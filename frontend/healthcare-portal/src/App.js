import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Cookies from "js-cookie";
import { Dashboard, Category } from '@mui/icons-material';
import '../src/pages/Home.css';
import Home from './pages/Home';
import Patients from './pages/Patients';
import Taxes from './pages/Taxes';
import Stocks from './pages/Stocks';
import DrawerTemplate from './components/DrawerTemplate';

const App = () => {

  const[isAutheticated, setisAutheticated] = useState(false);
  const location = useLocation();

  /*function logout(){
    Cookies.remove('jwt');
    setisAutheticated(false);
    window.location.reload()
  }*/

  useEffect(() => {
    setisAutheticated(true);
  }, [location]);

  return (
    <div className="root">
      <DrawerTemplate />
      <main className="content">
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
