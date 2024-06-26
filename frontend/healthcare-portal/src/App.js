import { useState } from 'react';

import Home from './components/Home';
import Patients from './components/Patients';
import Income from './components/Income';

import { authLogin } from './auth/login'

import { Routes, Route, Link, Navigate } from 'react-router-dom';

function NotFound() {
  return <div><h1>404 - Not Found</h1></div>;
}

function App() {

  const[isAutheticated, setisAutheticated] = useState(false);

  function login(){
    authLogin()
  }

  function logout(){
    setisAutheticated(false);
    alert("2");
  }

  function Test(){
    let { code } = useParams();
    alert(code);
  }

  return (
    <div>

      <div>
        <Link to="/Home">Home</Link>
        <Link to="/Patients">Patients</Link>
        <Link to="/Income">Income</Link>
      </div>

      <div>
        <button onClick={login}>Login</button>
        <br/>
        <button onClick={logout}>Logout</button>
      </div>

      <Routes>
        <Route path="/Home" element={ <Home/> } />
        <Route path="/Patients" element={ isAutheticated ? <Patients/> : <Navigate to="/Home" /> } />
        <Route path="/Income" element={ isAutheticated ? <Income/> : <Navigate to="/Home" /> } />
        <Route path="/" element={ <Home/> } />
        <Route path="/:code?" element={ <Test/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;
