import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './SetbudgetPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

library.add(fas);

const SetbudgetPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [categories, setCategories] = useState([
    { id: 'food', name: 'Food', icon: 'utensils', allocated: '', initial: 1450 },
    { id: 'rent', name: 'Rent/Mortgage', icon: 'house', allocated: '', initial: 1200 },
    { id: 'utilities', name: 'Utilities', icon: 'lightbulb', allocated: '', initial: 300 },
    { id: 'transport', name: 'Transport', icon: 'car', allocated: '', initial: 200 },
    { id: 'entertainment', name: 'Entertainment', icon: 'ticket', allocated: '', initial: 150 },
  ]);
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const totalAllocated = categories.reduce((sum, cat) => sum + Number(cat.allocated || 0), 0) + Number(monthlySavingsGoal || 0);
  const availableForBudgeting = Number(monthlyIncome || 0) - totalAllocated;

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 1. Get token and user ID from localStorage 
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId'); // Assuming you store userId on login

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    } else {
      console.warn("User not logged in or token/userId missing. Cannot fetch budget.");
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }

    // 2. Fetch current month's budget
    const fetchBudget = async () => {
      // Get current month in YYYY-MM format
      const currentMonth = new Date().toISOString().slice(0, 7);

      try {
        const response = await fetch(`http://localhost:5000/budget?month=${currentMonth}`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.budget) {
            setMonthlyIncome(data.budget.monthlyIncome.toString());
            setMonthlySavingsGoal(data.budget.monthlySavingsGoal.toString());

  
            setCategories(prevCats => {
              const updatedCats = prevCats.map(initialCat => {
                const fetchedCat = data.budget.categories.find(fCat => fCat.name === initialCat.name);
                return fetchedCat ? { ...initialCat, allocated: fetchedCat.allocated.toString() } : initialCat;
              });

              // Add any custom categories from the backend that aren't in our initial list
              const customFetchedCategories = data.budget.categories.filter(fCat =>
                !prevCats.some(pCat => pCat.name === fCat.name)
              ).map(fCat => ({
                id: `custom-${fCat._id || Date.now()}`, // Use backend _id if available, otherwise generate
                name: fCat.name,
                icon: fCat.icon || 'folder',
                allocated: fCat.allocated.toString()
              }));

              return [...updatedCats, ...customFetchedCategories];
            });

            showNotification('Budget loaded successfully!', 'success');
          } else {
            // No budget found for this month, user can start fresh
            showNotification('No budget found for this month. Please set your budget.', 'info');
          }
        } else if (response.status === 404) {
          showNotification('No budget found for this month. Please set your budget.', 'info');
        } else {
          console.error("Failed to fetch budget:", await response.json());
          showNotification('Failed to load budget. Please try again.', 'error');
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
        showNotification('An error occurred while loading the budget.', 'error');
      }
    };

    fetchBudget();
  }, []); // Run once on mount

  const handleIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  const handleCategoryAllocationChange = (id, value) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, allocated: value } : cat
      )
    );
  };

  const handleCategoryNameChange = (id, value) => {
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.id === id ? { ...cat, name: value } : cat
      )
    );
  };

  const handleAddCategory = () => {
    const newId = `custom-${Date.now()}`;
    setCategories(prevCategories => [
      ...prevCategories,
      { id: newId, name: `New Category`, icon: 'folder', allocated: '' }
    ]);
  };

  const handleRemoveCategory = (id) => {
    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveBudget = async () => {
    if (!token || !userId) {
      showNotification('You must be logged in to save a budget.', 'error');
      // Redirect to login or handle unauthenticated state
      setTimeout(()=>{
        navigate('/login');
      },2000);
    }

    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      showNotification('Please enter a valid monthly income.', 'error');
      return;
    }
    if (availableForBudgeting < 0) {
      showNotification('You have over-budgeted! Please adjust your allocations.', 'error');
      return;
    }

    const budgetData = {
      monthlyIncome: Number(monthlyIncome),
      categories: categories.map(({ name, icon, allocated }) => ({
        name,
        icon,
        allocated: Number(allocated || 0)
      })),
      monthlySavingsGoal: Number(monthlySavingsGoal || 0),
    };

    console.log("Saving Budget:", budgetData);
    showNotification('Saving budget...', 'info');
    setTimeout(()=>{
        navigate('/');
      },2000);

    try {
      const response = await fetch('http://localhost:5000/budget', { // Ensure correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(budgetData),
      });

      if (response.ok) {
        showNotification('Budget saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error("Failed to save budget:", errorData);
        showNotification(`Failed to save budget: ${errorData.message || response.statusText}`, 'error');
        setTimeout(()=>{
        navigate('/');
      },2000);
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      showNotification('An error occurred while saving the budget.', 'error');
      setTimeout(()=>{
        navigate('/');
      },2000);
    }
  };

  const handleReset = () => {
    setMonthlyIncome('');
    setCategories(prevCategories =>
      prevCategories.map(cat => ({ ...cat, allocated: '' }))
    );
    setMonthlySavingsGoal('');
    showNotification('Budget reset!', 'info');
  };

  return (
    <>
    <div className="set-budget-page">
      <div className="page-header">
        <h1>Set Your Monthly Budget</h1>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          <FontAwesomeIcon icon={
            notification.type === 'success' ? 'check-circle' :
            notification.type === 'error' ? 'exclamation-circle' :
            'info-circle'
          } />
          <span>{notification.message}</span>
        </div>
      )}

      <div className="budget-summary-bar">
        <div className="income-input-group">
          <label htmlFor="monthly-income">Monthly Income</label>
          <div className="input-with-icon">
            <span className="currency-symbol"></span>
            <input
              type="number"
              id="monthly-income"
              value={monthlyIncome}
              onChange={handleIncomeChange}
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>
        <div className="available-display">
          <span>Available for Budgeting:</span>
          <span className={`available-amount ${availableForBudgeting < 0 ? 'negative' : ''}`}>
            ₹{availableForBudgeting.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="expense-categories-section">
        <h2>Expense Categories</h2>
        <div className="categories-list">
          {categories.map(cat => (
            <div key={cat.id} className="category-item">
              <div className="category-info">
                <FontAwesomeIcon icon={cat.icon} />
                {cat.id.startsWith('custom-') ? (
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) => handleCategoryNameChange(cat.id, e.target.value)}
                    className="custom-category-name-input"
                  />
                ) : (
                  <span>{cat.name}</span>
                )}
              </div>
              <div className="category-allocation-input">
                <span className="currency-symbol">₹</span>
                <input
                  type="number"
                  value={cat.allocated}
                  onChange={(e) => handleCategoryAllocationChange(cat.id, e.target.value)}
                  placeholder="0.00"
                  min="0"
                />
                {cat.id.startsWith('custom-') && (
                  <button className="remove-category-btn" onClick={() => handleRemoveCategory(cat.id)}>
                    <FontAwesomeIcon icon="times" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="add-category-btn" onClick={handleAddCategory}>
          <FontAwesomeIcon icon="plus-circle" /> Add New Category
        </button>
      </div>

      <div className="savings-goal-section">
        <FontAwesomeIcon icon="piggy-bank" />
        <label htmlFor="monthly-savings">Monthly Savings Goal</label>
        <div className="input-with-icon">
          <span className="currency-symbol"></span>
          <input
            type="number"
            id="monthly-savings"
            value={monthlySavingsGoal}
            onChange={(e) => setMonthlySavingsGoal(e.target.value)}
            placeholder="0.00"
            min="0"
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="save-budget-btn" onClick={handleSaveBudget}>
          Save Budget
        </button>
        <button className="reset-budget-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
    </>
    
  );
};

export default SetbudgetPage;
