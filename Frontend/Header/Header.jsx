import React from 'react';
import './Header.css'; // Importing the CSS file
import Logo from '../../src/assets/logo.png'


const Header = () => {
  return (
    <div className="mmainheader">
      <div className="hleft-section">
        <img src={Logo} alt="Logo" className="hlogo" />
      </div>
      <div className="hcenter-section">
        <ul>
          <li><a href="url" className="hhui2">Home</a></li>
          <li><a href="url" className="hhui2">Men</a></li>
          <li><a href="url" className="hhui2">Women</a></li>
          <li><a href="url" className="hhex">Exclusive</a></li>
        </ul>
      </div>
      <div className="hright-section">
        <ul className="hhui1">
          <li>
            <form action="" className="searchh">
              <input type="search" className="hsearch" required />
              <i className="fa fa-search"></i>
            </form>
          </li>

          <li><div className="hhui22"><i className="far fa-user-circle fa-xl" style={{ color: '#ffffff' }}></i></div></li>
          <li><div className="hhui22"><i className="fas fa-cart-shopping fa-xl" style={{ color: '#ffffff' }}></i></div></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
