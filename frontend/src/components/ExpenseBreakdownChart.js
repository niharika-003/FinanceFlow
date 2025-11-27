import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Card.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = ({ expensesByCategory }) => {
    if (!expensesByCategory || expensesByCategory.length === 0) {
        return <div className="card chart-card"><h3>Expense Breakdown</h3><p>No expenses recorded yet.</p></div>;
    }

    const labels = expensesByCategory.map(item => item.name);
    const dataValues = expensesByCategory.map(item => item.spent);
    const totalSpent = dataValues.reduce((sum, val) => sum + val, 0);

    const data = {
        labels: labels,
        datasets: [{
            data: dataValues,
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED'
            ],
            hoverOffset: 10,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Expense Breakdown',
                font: {
                    size: 16
                }
            }
        },
        cutout: '70%',
    };

    return (
        <div className="card chart-card">
            <h3>Expense Breakdown</h3>
            <div className="chart-container">
                <Doughnut data={data} options={options} />
            </div>
            <div className="chart-center-text">
                ₹{totalSpent.toLocaleString('en-IN')} Spent
            </div>
        </div>
    );
};

export default ExpenseBreakdownChart;