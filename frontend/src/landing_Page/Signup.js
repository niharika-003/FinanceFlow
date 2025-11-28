import react,{useState} from "react";
import'./Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

function Signup() {
  const[username,setUsername]=useState('');
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const[message,setMessage]=useState('');
  const[isError,setIsError]=useState(false);
  const navigate = useNavigate(); 


  const handleSubmit=async(e)=>{
    e.preventDefault();
    // hideFlashMessage();

    setMessage('');
    setIsError(false);

    try{
      const response=await fetch('https://financeflow-backend-ao63.onrender.com/signup',{
        method:'POST',
        headers:{
          'content-type':'application/json',
        },
        body:JSON.stringify({username,email,password}),
      });

      const data=await response.json();

      if(response.ok){
        setMessage(data.message);
        setIsError(false);
        // showFlashMessage(data.message, 'success');
        setUsername('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          navigate('/login'); 
        }, 1000);
      }else{
        setMessage(data.message || 'Signup failed.Please try again.');
        setIsError(true);
        setTimeout(() => {
          navigate('/'); 
        }, 2000);
      }
      
    }catch(err){
      console.error('Signup error:',err);
      setMessage('An error occurred during signup. Please try again later.');
      setIsError(true);
      setTimeout(() => {
        navigate('/'); 
      }, 2000);
    }
  }
  return (
    <>
    <div className="signup-container">
      <div className="signup-card">
        
        <div className="page-header">
          <h1 style={{fontWeight:"bold"}}>SignUp on FinanceFlow</h1>
        </div>

        {message && (
          <div className={`notification ${isError ? 'error' : 'success'}`}>
            <FontAwesomeIcon icon={isError ? 'exclamation-circle' : 'check-circle'} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon"><FontAwesomeIcon icon="user" /></span>
              <input
                name="username"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

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
            <button type="submit" className="signup-btn">
              Sign Up <FontAwesomeIcon icon="arrow-right" style={{marginLeft: '8px'}}/>
            </button>
          </div>

        </form>
      </div>
    </div>
    </>   
  );
}

export default Signup;
