import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.name),
        datasets: [
            {
                label: 'Budgeted',
                data: data.map(d => d.budgeted),
                backgroundColor: '#cbd5e1',
                borderRadius: 4,
            },
            {
                label: 'Actual Spent',
                data: data.map(d => d.spent),
                backgroundColor: data.map(d => d.spent > d.budgeted ? '#ef4444' : '#10b981'),
                borderRadius: 4,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Budget vs. Actual Spending' }
        }
    };

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default ComparisonChart;