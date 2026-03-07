import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './TargetPage.css'; 
import { useNavigate } from 'react-router-dom';

library.add(fas);

// --- Notification Component ---
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
  const [targets, setTargets] = useState([]); 
  const [targetName, setTargetName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [targetMonth, setTargetMonth] = useState(''); 
  const [notification, setNotification] = useState(null);
  
  // NEW STATE: Tracks how much you are allowed to save based on your Budget
  const [maxSavingsAllowed, setMaxSavingsAllowed] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); 
    setTargetMonth(currentMonth);
    fetchTargets();
    fetchMonthlySavingsLimit(currentMonth); // Load initial limit
  }, []);

  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => setNotification(null), duration);
    }
  };

  // --- LOGIC: Fetch the Savings Goal from the Budget Page ---
  const fetchMonthlySavingsLimit = async (month) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://financeflow-backend-ao63.onrender.com/budget?month=${month}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // This takes the "Monthly Savings Goal" value you set in the Budget Page
        const limit = data.budget?.monthlySavingsGoal || 0;
        setMaxSavingsAllowed(limit);
      } else {
        setMaxSavingsAllowed(0);
        console.warn("Could not find a budget for this month.");
      }
    } catch (error) {
      console.error("Error fetching savings limit:", error);
    }
  };

  const fetchTargets = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please log in to view targets.', 'error');
      setTimeout(() => navigate('/login'), 2000);
      return;
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
      }
    } catch (error) {
      showNotification('An error occurred while fetching targets.', 'error');
    }
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setTargetMonth(selectedMonth);
    fetchMonthlySavingsLimit(selectedMonth); // Update the limit when month changes
  };

  const handleAddTarget = async () => {
    if (!targetName.trim()) {
      showNotification('Please enter a name for your goal.', 'error');
      return;
    }

    const cost = Number(estimatedCost);

    // --- STRICT LOGIC CHECK ---
    if (cost <= 0) {
      showNotification('Please enter a valid cost.', 'error');
      return;
    }

    if (cost > maxSavingsAllowed) {
      showNotification(
        `Strict Limit: Your goal (₹${cost}) cannot exceed your planned savings (₹${maxSavingsAllowed}) for this month.`, 
        'error'
      );
      return;
    }

    const newTarget = {
      name: targetName.trim(),
      estimatedCost: cost,
      targetMonth: targetMonth,
    };

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://financeflow-backend-ao63.onrender.com/target', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTarget),
      });

      if (response.ok) {
        const data = await response.json();
        setTargets(prev => [...prev, data.target]);
        showNotification('Goal added successfully!', 'success');
        setTargetName('');
        setEstimatedCost('');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to add target.', 'error');
      }
    } catch (error) {
      showNotification('An error occurred.', 'error');
    }
  };

  const handleRemoveTarget = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://financeflow-backend-ao63.onrender.com/target/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setTargets(prev => prev.filter(t => t._id !== id));
        showNotification('Goal removed.', 'success');
      }
    } catch (error) {
      showNotification('Error removing goal.', 'error');
    }
  };

  return (
    <div className="target-of-month-page">
      <div className="page-header">
        <h1>Set Your Monthly Goals</h1>
        <p>Goals must stay within your monthly savings limit.</p>
      </div>

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div className="target-form-container">
        <h2>Add a New Goal</h2>

        {/* Informative box for the user */}
        <div className="savings-limit-display" style={{ 
            background: '#f0f9ff', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            border: '1px solid #bae6fd' 
        }}>
            <p style={{ margin: 0, color: '#0369a1', fontWeight: 'bold' }}>
                <FontAwesomeIcon icon="info-circle" /> Max Goal Cost for {targetMonth}: ₹{maxSavingsAllowed.toLocaleString()}
            </p>
            <small style={{ color: '#0c4a6e' }}>This is your savings goal set in the Budget Page.</small>
        </div>

        <div className="form-group">
          <label>Goal Name</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="bullseye" className="input-prefix-icon" />
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="e.g., Buy Laptop"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Estimated Cost (Must be ≤ ₹{maxSavingsAllowed})</label>
          <div className="input-with-icon">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Target Month</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="calendar-alt" className="input-prefix-icon" />
            <input
              type="month"
              value={targetMonth}
              onChange={handleMonthChange}
            />
          </div>
        </div>

        <button className="add-target-btn" onClick={handleAddTarget}>
          <FontAwesomeIcon icon="plus-circle" /> Add Goal
        </button>
      </div>

      <div className="current-targets-section">
        <h2>Active Goals</h2>
        {targets.length === 0 ? (
          <p className="no-targets-message">No goals set yet.</p>
        ) : (
          <div className="targets-list">
            {targets.map(target => (
              <div key={target._id} className="target-item">
                <div className="target-info">
                  <FontAwesomeIcon icon="bullseye" className="target-icon" />
                  <h3>{target.name}</h3>
                  <p><b>Cost:</b> ₹{target.estimatedCost.toLocaleString()}</p>
                  <p><b>Month:</b> {target.targetMonth}</p>
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
  );
};

export default TargetPage;