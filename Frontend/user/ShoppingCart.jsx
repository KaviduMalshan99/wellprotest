import React from 'react'
import './shoppingcart.css'

function ShoppingCart() {
  return (
    <div>
      <div className="form-with-image">
      <div className="form-section">
        <form>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" id="firstName" placeholder="Enter your first name" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" id="lastName" placeholder="Enter your last name" />
          </div>
          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number:</label>
            <input type="text" id="contactNumber" placeholder="Enter your contact number" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
        </form>
      </div>
      <div className="image-section">
        
      </div>
    </div>
    </div>
  )
}

export default ShoppingCart