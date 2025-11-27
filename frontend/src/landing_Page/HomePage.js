import React from 'react';
import Navbar from '../landing_Page/Navbar.js';
import About from '../landing_Page/About.js';
import Features from '../landing_Page/Features.js';
import Account from '../landing_Page/Account.js';
import Footer from '../landing_Page/Footer.js';

function HomePage() {
  return (
    <>
    <About/>
    <Features/>
    <Account/>
    <Footer/>
    </>
  );
}

export default HomePage;