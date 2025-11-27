import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';
import './index.css';
import Navbar from './landing_Page/Navbar';
import HomePage from './landing_Page/HomePage';
import Signup from './landing_Page/Signup';
import Footer from './landing_Page/Footer';
import Login from './landing_Page/Login';
import SetbudgetPage from './landing_Page/SetbudgetPage';
import AddexpensePage from './landing_Page/AddexpensePage';
import TargetPage from './landing_Page/TargetPage';
import DashboardPage from './landing_Page/DashboardPage';
import { AuthProvider } from '../src/AuthContext'; 

function AppContent(){
  const location = useLocation();
  const hideNavbar = location.pathname === '/dashboard';

  return(
    <>
     {!hideNavbar && <Navbar />}
     <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/budget' element={<SetbudgetPage/>}/>
    <Route path='/addexpense' element={<AddexpensePage/>}/>
    <Route path='/target' element={<TargetPage/>}/>
    <Route path='/dashboard' element={<DashboardPage/>}/>
    {/* <Route path='*' element={<NotFound/>}/> */}
  </Routes>
    </>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <AuthProvider>
    <AppContent/>
  </AuthProvider>  
  </BrowserRouter>
);


