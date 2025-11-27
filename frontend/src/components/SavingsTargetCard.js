import React from 'react';
import './Card.css';

const SavingsTargetCard = ({ target, progress }) => {
    if (!target) {
        return <div className="card placeholder-card">No savings target set for this month.</div>;
    }

    const { name, estimatedCost, targetMonth } = target;
    const formattedCost = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(estimatedCost);
    const displayProgress = Math.max(0, Math.min(100, progress)).toFixed(0);

    return (
        <div className="card savings-target-card">
            <h3 style={{fontWeight:'bold',fontSize:'25px'}}>Savings Target</h3>
            <p className="target-name"><b>GOAL</b>: {name}</p>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${displayProgress}%` }}></div>
            </div>
            <div className="target-details">
                <span>{formattedCost}</span> / <span>{formattedCost}</span>
                <span className="target-month">{targetMonth}</span>
            </div>
        </div>
    );
};

export default SavingsTargetCard;