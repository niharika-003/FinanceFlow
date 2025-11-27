import React from "react";
import "./Account.css";
import { Link } from "react-router-dom"; 

function Account(){
    return(
        <div className='call-to-action-section'> 
            <div className='call-to-action-content'> 
                <h2 className='call-to-action-title'>Ready to achieve Financial Peace?</h2>
                <p className='call-to-action-description'>Click the button below and start your financial journey now!</p>
                <Link to='/signup' className='call-to-action-btn' >Start Now</Link>
            </div>
        </div>
    )
}

export default Account; 