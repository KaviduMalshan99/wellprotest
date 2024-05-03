import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate(); // Initializing navigate function

  const handleRefundClick = () => {
    // Redirect to the Refund page when the button is clicked
    navigate('/refundorder');
  };

  return (
    <div className='mainContainer'>
      {/* Button triggering the refund */}
      <button type="button" className='rbutton' onClick={handleRefundClick}>Refund Orders</button>
      <button type="button" className='rbutton' >Orders</button>
      <button type="button" className='rbutton' >Cancel Orders</button>

    </div>
  );
};

export default Orders;