import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './admin.css';
import Logo from '../src/assets/logo.png';

const Admin = () => {
  const [selectedSection, setSelectedSection] = useState('dashboard');

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="admin-container">
      <div className="nav-bar">
        <div className="company-logo">
          <img src={Logo} alt="Wellworn Logo" />
        </div>

        <div className="navlinks">
          <Link to="/admin/dashboard" className={`nav-link ${selectedSection === 'dashboard' && 'active'}`} onClick={() => handleSectionChange('dashboard')}>
            <i className='fas fa-tachometer-alt'/> Dashboard
          </Link>
          <Link to="/admin/profile" className={`nav-link ${selectedSection === 'profile' && 'active'}`} onClick={() => handleSectionChange('profile')}>
            <i className='fas fa-user'/> Profile
          </Link>
          <Link to="/admin/products" className={`nav-link ${selectedSection === 'products' && 'active'}`} onClick={() => handleSectionChange('products')}>
            <i className='fas fa-shopping-bag'/> Products
          </Link>
          <Link to="/admin/users" className={`nav-link ${selectedSection === 'users' && 'active'}`} onClick={() => handleSectionChange('users')}>
            <i className='fas fa-users'/> Users
          </Link>
          <Link to="/admin/orders" className={`nav-link ${selectedSection === 'orders' && 'active'}`} onClick={() => handleSectionChange('orders')}>
            <i className='fas fa-shopping-cart'/> Orders
          </Link>
          <Link to="/admin/rating" className={`nav-link ${selectedSection === 'rating' && 'active'}`} onClick={() => handleSectionChange('rating')}>
            <i className='fas fa-star'/> Ratings
          </Link>
          <Link to="/admin/supplier" className={`nav-link ${selectedSection === 'supplier' && 'active'}`} onClick={() => handleSectionChange('supplier')}>
            <i className='fas fa-truck'/> Suppliers
          </Link>
          <Link to="/admin/warehouse" className={`nav-link ${selectedSection === 'warehouse' && 'active'}`} onClick={() => handleSectionChange('warehouse')}>
            <i className='fas fa-warehouse'/> Warehouse
          </Link>
          <Link to="/admin/overview" className={`nav-link ${selectedSection === 'overview' && 'active'}`} onClick={() => handleSectionChange('overview')}>
            <i className='fas fa-chart-simple'/> Overview
          </Link>
        </div>
      </div>

      <div className="content-area">
        <Outlet />  {/* This component will render the matched child route component. */}
      </div>
    </div>
  );
};

export default Admin;
