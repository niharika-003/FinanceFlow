import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import WelcomeCard from '../components/WelcomeCard';
import MonthlyOverviewCard from '../components/MontlyOverviewCard';
import ComparisonChart from '../components/ComparisonChart';
import CategoryHealth from '../components/CategoryHealth';
import SavingsTargetCard from '../components/SavingsTargetCard';
import RecentTransactionsList from '../components/RecentTransactionsList';

import './DashboardPage.css';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [targets, setTargets] = useState([]);
    const [error, setError] = useState(null);
    
    // Pagination state for Transactions
    const [transactionPage, setTransactionPage] = useState(0);

    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const [totalSpent, setTotalSpent] = useState(0);
    const [totalAllocated, setTotalAllocated] = useState(0);
    const [remainingBudget, setRemainingBudget] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token || !userId) {
                setLoading(false);
                setError("Authentication required.");
                return;
            }

            setLoading(true);
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const currentMonth = new Date().toISOString().slice(0, 7);

            try {
                const [budgetRes, expensesRes, targetsRes] = await Promise.all([
                    axios.get(`https://financeflow-backend-ao63.onrender.com/budget?month=${currentMonth}`, config),
                    axios.get(`https://financeflow-backend-ao63.onrender.com/expenses?month=${currentMonth}`, config),
                    axios.get('https://financeflow-backend-ao63.onrender.com/targets', config)
                ]);

                setBudget(budgetRes.data.budget);
                setExpenses(expensesRes.data.expenses);
                setTargets(targetsRes.data.targets);

                const spent = expensesRes.data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
                const allocated = budgetRes.data.budget?.categories.reduce((sum, cat) => sum + cat.allocated, 0) || 0;

                setTotalSpent(spent);
                setTotalAllocated(allocated);
                setRemainingBudget((budgetRes.data.budget?.monthlyIncome || 0) - spent);

            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token, userId]);

    // --- CALCULATIONS FOR MEANINGFUL INSIGHTS ---

    // 1. Daily Burn Rate: How much can I spend today?
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const daysLeft = (daysInMonth - today) || 1;
    const dailyLimit = remainingBudget > 0 ? (remainingBudget / daysLeft).toFixed(0) : 0;

    // 2. Category Analysis (Budget vs Actual)
    const categoryAnalysis = budget?.categories.map(cat => {
        const spent = expenses
            .filter(exp => exp.categoryId === cat.name.toLowerCase().replace(/\s/g, '-'))
            .reduce((sum, exp) => sum + exp.amount, 0);
        return {
            name: cat.name,
            budgeted: cat.allocated,
            spent: spent,
            remaining: cat.allocated - spent,
            percentUsed: (spent / cat.allocated) * 100
        };
    }) || [];

    // 3. Savings Progress: Based on actual money left vs Goal Cost
    const currentTarget = targets.find(t => t.targetMonth === new Date().toISOString().slice(0, 7));
    const actualSavedThisMonth = (budget?.monthlyIncome || 0) - totalSpent;

    if (loading) return <div className="dashboard-message">Loading dashboard...</div>;

    return (
        <div className="dashboard-layout">
            <Sidebar currentPath="/dashboard" />
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="subtitle" style={{color: '#666'}}>
                            Burn Rate: <b>₹{dailyLimit}/day</b> allowed for {daysLeft} days.
                        </p>
                    </div>
                </header>

                <div className="dashboard-grid">
                    <WelcomeCard />
                    
                    <MonthlyOverviewCard
                        monthlyIncome={budget?.monthlyIncome || 0}
                        totalBudgeted={totalAllocated}
                        totalSpent={totalSpent}
                        remaining={remainingBudget}
                        savingsGoal={budget?.monthlySavingsGoal || 0}
                    />

                    {/* NEW: Comparative Bar Chart */}
                    <div className="card grid-col-span-2">
                         <ComparisonChart data={categoryAnalysis} />
                    </div>

                    {/* NEW: Vertical Health Bars */}
                    <CategoryHealth categories={categoryAnalysis} />

                    {/* UPDATED: Progress based on Actual Savings */}
                    <SavingsTargetCard 
                        target={currentTarget} 
                        actualSavings={actualSavedThisMonth} 
                    />

                    {/* UPDATED: Pagination strictly 3 items */}
                    <RecentTransactionsList 
                        expenses={expenses} 
                        budgetCategories={budget?.categories || []}
                        currentPage={transactionPage}
                        setCurrentPage={setTransactionPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;












