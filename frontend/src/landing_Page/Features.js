import React from 'react';
import { Link } from 'react-router-dom';
import './Features.css';

function Features() {
  return (
    <div className='features-section'> 
      <h2 className='features-heading'>Key Features to Manage Your Finances</h2> 
      <div className='features-grid'>

       
        <Link to="/budget" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon-container">
              <img src="/media/images/piggybank.png" alt="Piggy Bank Icon" className="feature-icon" />
            </div>
            <div className="card-body">
              <h5 className="card-title"><b>Smart Budgeting</b></h5>
              <p className="card-text">Start setting a budget for your monthly expenses.</p>
            </div>
          </div>
        </Link>

        
        <Link to="/addexpense" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon-container">
              <img src="/media/images/tracking.png" alt="Tracking Icon" className="feature-icon" />
            </div>
            <div className="card-body">
              <h5 className="card-title"><b>Effortless Tracking</b></h5>
              <p className="card-text">Add your expenses and track them with ease.</p>
            </div>
          </div>
        </Link>

        <Link to="/target" className="feature-card-link">
          <div className="feature-card">
            <div className="feature-icon-container">
              <img src="/media/images/target.png" alt="Target Icon" className="feature-icon" />
            </div>
            <div className="card-body">
              <h5 className="card-title"><b>Target of the Month</b></h5>
              <p className="card-text">Set up a target to achieve in the month.</p>
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default Features;