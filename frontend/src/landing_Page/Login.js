import react, { useState } from "react";
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

function Login(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [message,setMessage]=useState('');
    const [isError,setIsError]=useState(false);
     const navigate = useNavigate(); 
     const {login}=useAuth();

    const handleSubmit=async(e)=>{
      e.preventDefault();
      setMessage('');
      setIsError(false);

      try{
        const response=await fetch('https://financeflow-backend-ao63.onrender.com/login',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({email,password}),
        });

        const data=await response.json();
        if(response.ok){
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.user.id);
          login();
          setMessage(data.message);
          setIsError(false);
          setEmail('');
          setPassword('');
          setTimeout(() => {
          navigate('/'); 
        }, 2000);
          //console.log("User data on successful login:", data.user);
        // In a real app, you'd handle authentication (e.g., store JWT) and redirection here.
        }else{
          setMessage(data.message || 'Login failed.please try again');
          setIsError(true);
          setTimeout(() => {
          navigate('/'); 
        }, 2000);
          //  const errorData = await response.json();
          //  alert(`Login failed: ${errorData.message}`);
        }
      }catch(err){
        console.error('Login error:',err);
        setMessage('An error occurred during login.please try again');
        setIsError(true);
        setTimeout(() => {
          navigate('/'); 
        }, 2000);
      }
    };

    return (
     <>
       <div className="login-container ">
      <div className="login-card">
        
        <div className="page-header">
          <h1>Login to FinanceFlow</h1>
        </div>

        {/* Notification Area */}
        {message && (
          <div className={`notification ${isError ? 'error' : 'success'}`}>
            <FontAwesomeIcon icon={isError ? 'exclamation-circle' : 'check-circle'} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <span className="input-icon"><FontAwesomeIcon icon="envelope" /></span>
              <input
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><FontAwesomeIcon icon="lock" /></span>
              <input
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="action-buttons">
            <button type="submit" className="login-btn">
              Login <FontAwesomeIcon icon="sign-in-alt" style={{marginLeft: '8px'}}/>
            </button>
          </div>

        </form>
      </div>
    </div>
     </>
    )
}

export default Login;