import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Card.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetAllocationChart = ({ categories }) => {
    if (!categories || categories.length === 0) {
        return <div className="card chart-card"><h3><b>Budget Allocation</b></h3><p>No categories with allocated budget.</p></div>;
    }

    const data = {
        labels: categories.map(cat => cat.name),
        datasets: [{
            data: categories.map(cat => cat.allocated),
            backgroundColor: [
                '#4BC0C0', '#FFCD56', '#FF6384', '#36A2EB', '#9966FF', '#FF9F40', '#E7E9ED'
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
                text: 'Budget Allocation',
                font: {
                    size: 16
                }
            }
        },
        cutout: '70%',
    };

    return (
        <div className="card chart-card">
            <h3>Budget Allocation</h3>
            <div className="chart-container">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

export default BudgetAllocationChart;