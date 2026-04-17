import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './AddexpensePage.css'; 
import { useNavigate } from 'react-router-dom';

library.add(fas);


const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  let icon = 'info-circle';
  if (type === 'success') icon = 'check-circle';
  else if (type === 'error') icon = 'exclamation-circle';

  return (
    <div className={`notification ${type}`}>
      <FontAwesomeIcon icon={icon} className="notification-icon" />
      <span>{message}</span>
      <button className="notification-close-btn" onClick={onClose}>
        <FontAwesomeIcon icon="times" />
      </button>
    </div>
  );
};


const AddexpensePage = () => {
  const [categories, setCategories] = useState([
    { id: 'food', name: 'Food', icon: 'utensils' },
    { id: 'rent', name: 'Rent/Mortgage', icon: 'house' },
    { id: 'utilities', name: 'Utilities', icon: 'lightbulb' },
    { id: 'transport', name: 'Transport', icon: 'car' },
    { id: 'entertainment', name: 'Entertainment', icon: 'ticket' },
    { id: 'custom-1', name: 'New Category', icon: 'folder' } // Example custom category
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchUserCategories=async()=>{
      const token=localStorage.getItem('token');
      if(!token){
        showNotification("You need to be logged in to add expense");
        setTimeout(()=>{
        navigate('/login');
      },2000);
      }

      try{
        const currentMonth=new Date().toISOString().slice(0,7); // YYYY-MM
        const response=await fetch(`http://localhost:5000/budget?month=${currentMonth}`,{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json',
          },
        });

        if(response.ok){
          const data=await response.json();
          const budgetCats=data.budget.categories.map(cat=>({
            id:cat.name.toLowerCase().replace(/\s+/g,'-'), // generate an id
            name:cat.name,
            icon:cat.icon || 'folder',
          }));
          setCategories(budgetCats);
          if(budgetCats.length>0){
            setSelectedCategory(budgetCats[0].id); // Pre-select the first category
          }else{
            const errorData=await response.json();
            showNotification(`Failed to load categories: ${errorData.message}`,'error');
          }
        } 
      }catch(err){
        console.error("Error fetching categories:",err);
        showNotification("An error occurred while fetching categories",'error');
        }
    }
    fetchUserCategories();
  }, []);

  const showNotification = (message, type = 'info', duration = 3000) => {
    setNotification({ message, type });
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  const handleAddExpense = async () => {
    if (!selectedCategory) {
      showNotification('Please select a category.', 'error');
      return;
    }
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      showNotification('Please enter a valid expense amount greater than ₹0.', 'error');
      return;
    }
    if (!expenseDescription.trim()) {
      showNotification('Please add a short description for the expense.', 'error');
      return;
    }

    const expenseData = {
      categoryId: selectedCategory,
      amount: Number(expenseAmount),
      description: expenseDescription.trim(),
      date: expenseDate,
    };

    console.log("Adding Expense:", expenseData);
    showNotification('Adding expense...', 'info', 0); 
    setTimeout(()=>{
        navigate('/');
    },2000);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('You are not logged in. Please log in to add expenses.', 'error');
        setTimeout(()=>{
        navigate('/login');
      },2000);
      }

      const response = await fetch('http://localhost:5000/addexpense', { // Your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the authentication token
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok){
        showNotification('Expense added successfully!', 'success');
        // Clear form
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseDate(new Date().toISOString().split('T')[0]);
      }else{
         const errorData = await response.json();
         showNotification(`Failed to add expense: ${errorData.message || response.statusText}`, 'error');
         setTimeout(()=>{
        navigate('/');
      },2000);
        }
    }catch (error) {
      console.error("Error adding expense:", error);
      showNotification('An error occurred while adding the expense.', 'error');
      setTimeout(()=>{
        navigate('/');
      },2000);
    }
  };

  const getCategoryIcon = (id) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.icon : 'question-circle'; // Default icon if not found
  }


  return (
    <>
      <div className="add-expense-page">
      <div className="page-header">
        <h1>Add New Expense</h1>
      </div>

      <Notification
        message={notification?.message}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />

      <div className="expense-form-container">
        <div className="form-group">
          <label htmlFor="category-select">Category</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={getCategoryIcon(selectedCategory)} className="input-prefix-icon" />
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="" disabled>Select an expense category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-amount">Amount</label>
          <div className="input-with-icon">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              id="expense-amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-description">Description</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="comment-dollar" className="input-prefix-icon" />
            <input
              type="text"
              id="expense-description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
              placeholder="e.g., Groceries at Walmart, Dinner with friends"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-date">Date</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon="calendar-alt" className="input-prefix-icon" />
            <input
              type="date"
              id="expense-date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </div>
        </div>

        <button className="add-expense-btn" onClick={handleAddExpense}>
          <FontAwesomeIcon icon="plus-circle" /> Add Expense
        </button>
      </div>
    </div>
    </>
    
  );
};

export default AddexpensePage;
