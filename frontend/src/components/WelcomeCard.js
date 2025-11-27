import React from 'react';
import './Card.css';

const WelcomeCard = () => {
    return (
        <div className="card welcome-card">
            <img src="media/images/image.png" alt="User" className="user-avatar-large" style={{height:"150px",width:"150px"}}/>
            <h2><b>Welcome Back!</b></h2>
        </div>
    );
};

export default WelcomeCard;