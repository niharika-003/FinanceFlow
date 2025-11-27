import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartPie, faWallet, faCoins, faBullseye, faCog, faSignOutAlt, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ currentPath }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-section">
                    <i class="fa-solid fa-money-bill-wave logo-icon"></i>
                    <span className="logo-text">FinanceFlow</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => (isActive || currentPath === '/dashboard' ? 'active' : '')}>
                            <FontAwesomeIcon icon={faChartPie} /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/budget" className={({ isActive }) => (isActive || currentPath === '/budget' ? 'active' : '')}>
                            <FontAwesomeIcon icon={faWallet} /> Budget
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/addexpense" className={({ isActive }) => (isActive || currentPath === '/addexpense' ? 'active' : '')}>
                            <FontAwesomeIcon icon={faCoins} /> Expenses
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/target" className={({ isActive }) => (isActive || currentPath === '/target' ? 'active' : '')}>
                            <FontAwesomeIcon icon={faBullseye} /> Targets
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;