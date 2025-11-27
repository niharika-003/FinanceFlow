import React from 'react';
import './About.css';

function About(){
    return(
        <div className='about-section'> 
            <div className='about-content'> 
                <h1 className='about-title'>Take control of your Financial Future</h1>
                <p className='about-description'>Intelligent budgeting, Effortless Tracking, Smarter saving</p>
                <a href="/signup" className="about-startnow-btn" >Start Now</a>
            </div>
            <div className='about-image-container'> 
                <img src='/media/images/laptop1.png' alt='Laptop with FinanceFlow UI' className='about-image'/>
            </div>
        </div>
    )
}

export default About;