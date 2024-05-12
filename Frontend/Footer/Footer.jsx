import React from 'react';
import './Footer.scss'; // Import your CSS for styling
import logoImage from './wellwornlogo2.png'; // Adjust the path accordingly
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="footer">


<div className='socialbar'>
<ul className="social-links">
    <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
    <li><a href="#"><i className="fab fa-twitter"></i></a></li>
    <li><a href="#"><i className="fab fa-instagram"></i></a></li>
    <li><a href="#"><i className="fab fa-pinterest"></i></a></li> </ul>
    </div>

 
<div className='ftmcon'>
  <div className='logoos'>
    <img src={logoImage} alt="Well Worn Logo" className="logo" />
    <label>Well worn (Pvt) Ltd</label>
  </div>
     
        <div className="collection">
          <h3>COLLECTION</h3> <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/men">Men</Link></li>
            <li><Link to="/women">Women</Link></li>
            <li><Link to="/exclusive">Exclusive</Link></li>

           
          </ul>
        </div>
        <div className="info">
          <h3>INFO</h3> <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><Link to='/refund'>Refund and Returns</Link></li>
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Terms and Conditions</a></li>
          </ul>
        </div>
        <div className="connect">
          <h3>CONNECT</h3> <ul>
            <li><a href="#"><FontAwesomeIcon icon={faPhone} style={{ color: '#ffffff' }} /> 0719707610</a></li>
            <li><a href="#"><FontAwesomeIcon icon={faEnvelope} style={{ color: '#ffffff' }} /> wellworn@gmail.com</a></li>
            <li><a href="#"><FontAwesomeIcon icon={faGlobe} style={{ color: '#ffffff' }} /> www.wellworn.com</a></li>
            <li><input type={'email'} placeholder={'Enter Email'}></input></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        © Well Worn 2024 | All rights reserved <br/> Developed by Group
      </div>
    </footer>
  );
}

export default Footer;
