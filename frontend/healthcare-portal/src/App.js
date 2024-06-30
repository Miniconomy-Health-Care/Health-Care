import { useState, useEffect } from 'react';

import Home from './components/Home';
import Patients from './components/Patients';
import Income from './components/Income';
import Cookies from "js-cookie";

import { authLogin } from './auth/login'

import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

function NotFound() {
  return <div><h1>404 - Not Found</h1></div>;
}

function App() {

  const[isAutheticated, setisAutheticated] = useState(false);
  const location = useLocation();

  function login(){
    authLogin()
  }

  function logout(){
    setisAutheticated(false);
  }

  useEffect(() => {

    const validateToken = async () => {
      if(Cookies.get("jwt")){
        const response = await (await fetch("http://localhost:8080/verifyToken")).json()
        if(response.valid === true){
          setisAutheticated(true);
        }
        else{
          setisAutheticated(false);
        }
      }
      else{
        setisAutheticated(false);
      }
    }

    validateToken();
    
  }, [location]);

  return (
    <div>

      <div>
        <Link to="/Home">Home</Link>
        <Link to="/Patients">Patients</Link>
        <Link to="/Income">Income</Link>
      </div>

      {!isAutheticated && <div>
        <button onClick={login}>Login</button>
        <br/>
        <button onClick={logout}>Logout</button>
      </div>}

      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace/>}/>
        <Route path="/Home" element={ <Home/> } />
        <Route path="/Patients" element={ isAutheticated ? <Patients/> : <Navigate to="/Home" /> } />
        <Route path="/Income" element={ isAutheticated ? <Income/> : <Navigate to="/Home" /> } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;
