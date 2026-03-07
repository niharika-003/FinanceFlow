import React from 'react';

const RecentTransactionsList = ({ expenses, budgetCategories, currentPage, setCurrentPage }) => {
    // We show only 3 transactions per "page"
    const itemsPerPage = 3; 
    
    // Logic to get the 3 items for the current page
    const startIndex = currentPage * itemsPerPage;
    const paginatedItems = expenses.slice(startIndex, startIndex + itemsPerPage);
    
    // Calculate total pages
    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    const getCategoryName = (id) => {
        const cat = budgetCategories.find(c => c.name.toLowerCase().replace(/\s/g, '-') === id);
        return cat ? cat.name : 'Other';
    };

    return (
        <div className="card recent-transactions-list" style={{ minHeight: '320px' }}>
            <h3 style={{fontWeight:'bold',fontSize:'22px', marginBottom:'15px'}}>Recent Transactions</h3>
            
            {expenses.length === 0 ? (
                <p className="placeholder-text">No transactions yet.</p>
            ) : (
                <>
                    <ul className="transaction-ul">
                        {paginatedItems.map(exp => (
                            <li key={exp._id} className="trans-row">
                                <div className="trans-main">
                                    <span className="trans-date">
                                        {new Date(exp.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'})}
                                    </span>
                                    <span className="trans-desc">{exp.description}</span>
                                    <small className="trans-cat">({getCategoryName(exp.categoryId)})</small>
                                </div>
                                <span className="trans-amt">₹{exp.amount}</span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="pagination">
                        <button 
                            className="pagi-btn" 
                            disabled={currentPage === 0} 
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <i className="fa-solid fa-chevron-left"></i> Previous
                        </button>
                        
                        <span className="page-indicator">
                            {currentPage + 1} / {totalPages || 1}
                        </span>
                        
                        <button 
                            className="pagi-btn" 
                            disabled={startIndex + itemsPerPage >= expenses.length} 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Next <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecentTransactionsList;