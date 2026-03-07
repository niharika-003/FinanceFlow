import React from 'react';

const SavingsTargetCard = ({ target, actualSavings }) => {
    if (!target) return <div className="card placeholder-card">No savings target.</div>;

    const progress = Math.min(100, Math.max(0, (actualSavings / target.estimatedCost) * 100));

    return (
        <div className="card">
            <h3 style={{fontWeight:'bold',fontSize:'22px'}}>Goal Progress</h3>
            <p>Target: <b>{target.name}</b></p>
            <div style={{background:'#eee', height:'12px', borderRadius:'10px', margin:'15px 0'}}>
                <div style={{width: `${progress}%`, background: '#22c55e', height:'100%', borderRadius:'10px', transition: 'width 0.5s'}}></div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}>
                <span>Saved: ₹{actualSavings > 0 ? actualSavings : 0}</span>
                <span>Goal: ₹{target.estimatedCost}</span>
            </div>
        </div>
    );
};

export default SavingsTargetCard;