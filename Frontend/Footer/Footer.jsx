import React from 'react';
import './footer1.css'; // Import your CSS for styling
import logoImage from './wellwornlogo2.png'; // Adjust the path accordingly
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';


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
            <li><a href="#">Home</a></li>
            <li><a href="#">Men</a></li>
            <li><a href="#">Women</a></li>
            <li><a href="#">Exclusive</a></li>

           
          </ul>
        </div>
        <div className="info">
          <h3>INFO</h3> <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Refund and Returns</a></li>
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
