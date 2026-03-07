import React from 'react';

const CategoryHealth = ({ categories }) => {
    return (
        <div className="card category-health-card">
            <h3 style={{fontWeight:'bold',fontSize:'22px'}}>Category Pacing</h3>
            <div className="health-list" style={{marginTop: '15px'}}>
                {categories.map(cat => {
                    const isOver = cat.spent > cat.budgeted;
                    const statusClass = isOver ? 'status-danger' : cat.percentUsed > 85 ? 'status-warning' : 'status-safe';
                    
                    return (
                        <div key={cat.name} className="health-item" style={{marginBottom: '15px'}}>
                            <div className="health-info" style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                                <span>{cat.name}</span>
                                <span className={isOver ? 'negative-val' : ''} style={{fontSize:'12px'}}>
                                    {isOver ? `-₹${Math.abs(cat.remaining)} Over` : `₹${cat.remaining} Left`}
                                </span>
                            </div>
                            <div className="health-bar-bg" style={{background:'#eee', height:'8px', borderRadius:'10px', overflow:'hidden'}}>
                                <div 
                                    className={`health-bar-fill ${statusClass}`} 
                                    style={{ width: `${Math.min(cat.percentUsed, 100)}%`, height:'100%' }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryHealth;