import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './TargetPage.css'; 
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

library.add(fas);

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  else if (type === 'error') icon = 'exclamation-circle';

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <FontAwesomeIcon icon={icon} className="notification-icon" />
        <span>{message}</span>
      </div>
      
      <button className="notification-close-btn" onClick={onClose}>
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
  );
};

const TargetPage = () => {
  const [targets, setTargets] = useState([]); // State to hold multiple targets
  const [targetName, setTargetName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [targetMonth, setTargetMonth] = useState(''); // Format: YYYY-MM
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM
    setTargetMonth(currentMonth);
    fetchTargets();
  }, []);

  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => 
        setNotification(null), duration);
    }
  };

  const fetchTargets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('You need to be logged in to view targets.', 'error');
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }
    try {
      const response = await fetch('https://financeflow-backend-ao63.onrender.com/targets', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTargets(data.targets);
      } else {
        const errorData = await response.json();
        showNotification(`Failed to fetch targets: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error("Error fetching targets:", error);
      showNotification('An error occurred while fetching targets.', 'error');
    }
  };


  const handleAddTarget = async () => {
    if (!targetName.trim()) {
      showNotification('Please enter a name for your target.', 'error');
      return;
    }
    if (!estimatedCost || Number(estimatedCost) <= 0) {
      showNotification('Please enter a valid estimated cost for your target.', 'error');
      return;
    }
    if (!targetMonth) {
      showNotification('Please select a target month.', 'error');
      return;
    }

    const newTarget = {
      //id: Date.now(), // Unique ID for mock data
      name: targetName.trim(),
      estimatedCost: Number(estimatedCost),
      targetMonth: targetMonth, // YYYY-MM format
      // status: 'pending', // 'pending', 'achieved', 'shortfall'
    };

    console.log("Adding New Target:", newTarget);
    showNotification('Adding target...', 'info', 0);
    setTimeout(()=>{
        navigate('/');
    },2000);

    try {
      // Simulate API call to save target
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('You need to be logged in to add targets.', 'error');
        setTimeout(()=>{
        navigate('/login');
      },2000);
      }
      const response = await fetch('https://financeflow-backend-ao63.onrender.com/target', {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the authentication token
        },
        body: JSON.stringify(newTarget),
      });

      if (response.ok) {
        const data = await response.json();
        setTargets(prevTargets => [...prevTargets, data.target]); // Add new target from response
        showNotification('Target added successfully!', 'success');
        setTimeout(()=>{
        navigate('/');
      },2000);
        // Clear form
        setTargetName('');
        setEstimatedCost('');
        setTargetMonth(new Date().toISOString().slice(0, 7)); // Reset to current month
      } else {
        const errorData = await response.json();
        showNotification(`Failed to add target: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error("Error adding target:", error);
      showNotification('An error occurred while adding the target.', 'error');
    }
  };

  const handleRemoveTarget = async(id) => {

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('You are not logged in. Please log in to remove targets.', 'error');
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }

    showNotification('Removing target...', 'info', 0);

    try {
      const response = await fetch(`https://financeflow-backend-ao63.onrender.com/target/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTargets(prevTargets => prevTargets.filter(target => target._id !== id)); // Filter out the deleted target using _id
        showNotification('Target removed successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(`Failed to remove target: ${errorData.message || response.statusText}`, 'error');
      }
    } catch (error) {
      console.error("Error removing target:", error);
      showNotification('An error occurred while removing the target.', 'error');
    }
  
  };

  return (
    <>
    <div className="target-of-month-page">
      <div className="page-header">
        <h1>Set Your Monthly Targets</h1>
        <p>Define your financial goals for the month.</p>
      </div>

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div className="target-form-container">
        <h2>Add a New Goal</h2>
        <div className="form-group">
          <label htmlFor="target-name">Goal Name</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="bullseye" className="input-prefix-icon" />
            <input
              type="text"
              id="target-name"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g., Buy new mobile, Save for down payment"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="estimated-cost">Estimated Cost</label>
          <div className="input-with-icon">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              id="estimated-cost"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="target-month">Target Month</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="calendar-alt" className="input-prefix-icon" />
            <input
              type="month"
              id="target-month"
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
            />
          </div>
        </div>

        <button className="add-target-btn" onClick={handleAddTarget}>
          <FontAwesomeIcon icon="plus-circle" /> Add Goal
        </button>
      </div>

      <div className="current-targets-section">
        <h2>Your Current Goals</h2>
        {targets.length === 0 ? (
          <p className="no-targets-message">No goals set yet. Add one above!</p>
        ) : (
          <div className="targets-list">
            {targets.map(target => (
              <div key={target._id} className="target-item">
                <div className="target-info">
                  <FontAwesomeIcon icon="bullseye" className="target-icon" />
                  <h3>{target.name}</h3>
                  <p>Estimated: ₹{target.estimatedCost?target.estimatedCost.toFixed(2):'0.00'}</p>
                  <p>Target Month: {target.targetMonth}</p>
                </div>
                <button className="remove-target-btn" onClick={() => handleRemoveTarget(target._id)}>
                  <FontAwesomeIcon icon="trash-alt" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
    
  );
};

export default TargetPage;