import React from "react";
import './Navbar.css';
import Signup from "./Signup";
import Login from "./Login";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../AuthContext";

function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout=()=>{
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3 style={{color:'#FFF',fontWeight:'bold'}}><i class="fa-solid fa-money-bill-wave"/>FinanceFlow</h3>
      </div>

      <div className="navbar-actions">
        <a href="/" className="navbar-home-btn">Home</a>
        <a href="/dashboard" className="navbar-dashboard-btn">Dashboard</a>
        {isLoggedIn?(
          <button onClick={handleLogout} className="navbar-logout-btn">Log Out</button>
        ):(
          <>
            <Link to="/login" className="navbar-login-btn">Log In</Link>
            <Link to="/signup" className="navbar-signup-btn">Sign Up Free</Link>
          </>
        )
        }
      </div>
    </nav>

  );
}

export default Navbar;
























