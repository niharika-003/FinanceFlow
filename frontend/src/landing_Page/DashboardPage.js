import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import WelcomeCard from '../components/WelcomeCard';
import MonthlyOverviewCard from '../components/MontlyOverviewCard';
import BudgetAllocationChart from '../components/BudgetAllocationChart';
import ExpenseBreakdownChart from '../components/ExpenseBreakdownChart';
import SavingsTargetCard from '../components/SavingsTargetCard';
import RecentTransactionsList from '../components/RecentTransactionsList';

import './DashboardPage.css';

const DashboardPage = () => {
    const [loading,setLoading] = useState(true);
    const [budget,setBudget] = useState(null);
    const [expenses,setExpenses] = useState([]);
    const [targets,setTargets] = useState([]);
    const [error,setError] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    // const userString = localStorage.getItem('user');
    const user = {id:userId};
    const token=localStorage.getItem('token');

    const [totalSpent, setTotalSpent] = useState(0);
    const [totalAllocated, setTotalAllocated] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);
    const [monthlyIncomeThisMonth, setMonthlyIncomeThisMonth] = useState(0);

   
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token||!userId) {
                console.warn("Authentication data missing. User needs to log in.");
                setLoading(false);
                setError("Authentication required. Please log in.");
                // navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            const currentMonth = new Date().toISOString().slice(0, 7);

            try {
                const budgetRes = await axios.get(`http://localhost:5000/budget?month=${currentMonth}`, config);
                const fetchedBudget = budgetRes.data.budget;
                setBudget(fetchedBudget);
                 setMonthlyIncomeThisMonth(fetchedBudget?.monthlyIncome || 0); 

                const expensesRes = await axios.get(`http://localhost:5000/expenses?month=${currentMonth}`, config);
                const fetchedExpenses = expensesRes.data.expenses;
                setExpenses(fetchedExpenses);

                const targetsRes = await axios.get('http://localhost:5000/targets', config);
                setTargets(targetsRes.data.targets);

                const calculatedTotalSpent = fetchedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                setTotalSpent(calculatedTotalSpent);
 
                const calculatedTotalAllocated = fetchedBudget?.categories.reduce((sum, cat) => sum + cat.allocated, 0) || 0;

                 setRemainingBudget((fetchedBudget?.monthlyIncome || 0) - calculatedTotalSpent);

                setTotalAllocated(calculatedTotalAllocated);



            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    // navigate('/login');
                } else if (err.response && err.response.status === 404 && err.response.data.message.includes('Budget not found')) {
                    setError("No budget found for the current month. Please set up your budget first!");
                    setBudget(null);
                } else {
                    setError(err.response?.data?.message || "Failed to fetch dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token,userId, navigate]);


    
    const currentMonthTarget = targets.find(t => t.targetMonth === new Date().toISOString().slice(0,7));
    const budgetAllocationData=budget?.categories||[];
    const expenseBreakdownData = budget?.categories.map(budgetCat => {
        const spentForCategory = expenses
            .filter(exp => exp.categoryId === budgetCat.name.toLowerCase().replace(/\s/g, '-'))
            .reduce((sum, exp) => sum + exp.amount, 0);
        return {
            name: budgetCat.name,
            spent: spentForCategory
        };
    }).filter(item => item.spent > 0) || [];
     if (loading) {
        return <div className="dashboard-message">Loading dashboard...</div>;
    }
    if (error) {
        return <div className="dashboard-message error-message">{error}</div>;
    }

    
    return(
        <div className="dashboard-layout">
            <Sidebar currentPath="/dashboard" />
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard</h1>
                </header>
                <div className="dashboard-grid">
                    <WelcomeCard username={user.username || 'Guest'} />
                    <MonthlyOverviewCard
                        monthlyIncome={budget?.monthlyIncome || 0}
                        totalBudgeted={totalAllocated}
                        totalSpent={totalSpent}
                        remaining={remainingBudget}
                        savingsGoal={budget?.monthlySavingsGoal || 0}
                    />
                    {budgetAllocationData.length > 0 ? (
                        <BudgetAllocationChart categories={budgetAllocationData} />
                    ) : (
                        <div className="card placeholder-card">No budget allocated yet.</div>
                    )}
                    {expenseBreakdownData.length > 0 ? (
                        <ExpenseBreakdownChart expensesByCategory={expenseBreakdownData} />
                    ) : (
                        <div className="card placeholder-card">No expenses recorded yet.</div>
                    )}
                    {currentMonthTarget ? (
                        <SavingsTargetCard
                            target={currentMonthTarget}
                            progress={( (monthlyIncomeThisMonth - totalSpent) / (currentMonthTarget.estimatedCost || 1) ) * 100}
                        />
                    ) : (
                        <div className="card placeholder-card">No savings target set for this month.</div>
                    )}
                    {expenses.length > 0 ? (
                        <RecentTransactionsList expenses={expenses.slice(0, 5)} budgetCategories={budget?.categories || []} />
                    ) : (
                        <div className="card placeholder-card">No recent transactions.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
















