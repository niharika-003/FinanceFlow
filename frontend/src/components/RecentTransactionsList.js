import React from 'react';
import './Card.css';

const RecentTransactionsList = ({ expenses, budgetCategories }) => {
    if (!expenses || expenses.length === 0) {
        return <div className="card placeholder-card">No recent transactions.</div>;
    }

    const getCategoryName = (categoryId) => {
        const category = budgetCategories.find(cat => cat.name.toLowerCase().replace(/\s/g, '-') === categoryId);
        return category ? category.name : 'Uncategorized';
    };

    return (
        <div className="card recent-transactions-list">
            <h3 style={{fontWeight:'bold',fontSize:'25px'}}>Recent Transactions</h3>
            <ul>
                {expenses.map(expense => (
                    <li key={expense._id} className="transaction-item">
                        <div className="transaction-details">
                            <span className="transaction-date">
                                {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:
                            </span>
                            <span className="transaction-description">{expense.description}</span>
                            <span className="transaction-category">({getCategoryName(expense.categoryId)})</span>
                        </div>
                        <span className="transaction-amount">
                            ₹{expense.amount.toLocaleString('en-IN')}
                        </span>
                    </li>
                ))}
            </ul>
            <button className="view-all-button" style={{borderRadius:'20px'}}>View All Transactions</button>
        </div>
    );
};

export default RecentTransactionsList;