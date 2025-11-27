// frontend/src/components/MonthlyOverviewCard.js (No change)
import React from 'react';
import './Card.css';

const MonthlyOverviewCard = ({ monthlyIncome, totalBudgeted, totalSpent, remaining, savingsGoal }) => {
    const savingsProgress = savingsGoal > 0 ? Math.min(100, (monthlyIncome - totalSpent) / savingsGoal * 100).toFixed(0) : 0;
    const formattedIncome = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(monthlyIncome);
    const formattedBudgeted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalBudgeted);
    const formattedSpent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpent);
    const formattedRemaining = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(remaining);

    return (
        <div className="card monthly-overview-card">
            <h3 style={{fontWeight:'bold',fontSize:'25px'}}>Monthly Overview</h3>
            <div className="stats-grid">
                <div className="stat-item">
                    <strong>{formattedBudgeted}</strong>
                    <span>Total Budgeted</span>
                </div>
                <div className="stat-item">
                    <strong>{formattedSpent}</strong>
                    <span>Total Spent</span>
                </div>
                <div className="stat-item">
                    <strong>{formattedRemaining}</strong>
                    <span>Remaining</span>
                </div>
                <div className="stat-item">
                    <strong>{savingsProgress}%</strong>
                    <span>Savings Goal</span>
                </div>
            </div>
        </div>
    );
};

export default MonthlyOverviewCard;