import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//alutheka

const EmailStockForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [productId, setProductId] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [colorError, setColorError] = useState('');
  const [priceError, setPriceError] = useState('');

  const handleSendEmail = async () => {
    const emailData = {
      email,
      subject,
      message,
      productId,
      sizes,
      colors,
      quantity,
      price
    };

    try {
      // Make sure to include the full URL of the backend server
      await axios.post('http://localhost:3001/send-email', emailData);
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('There was an error sending the email. Please try again later.');
    }
  };

  const handleColorsChange = (e) => {
    // Validate that only letters, commas, and slashes are entered for colors
    const regex = /^[a-zA-Z\s,\/]*$/;
    if (regex.test(e.target.value) || e.target.value === '') {
      setColors(e.target.value);
      setColorError('');
    } else {
      setColorError('Type only letters, commas, or slashes!');
    }
  };

  const handlePriceChange = (e) => {
    // Validate that only numbers or dots are entered for price
    const regex = /^\d*\.?\d*$/;
    if (regex.test(e.target.value) || e.target.value === '') {
      setPrice(e.target.value);
      setPriceError('');
    } else {
      setPriceError('Type only numbers or dots.');
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 40px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ebe9e9", marginTop: "15%", marginBottom: "40px" }}>
      <div style={{ maxWidth: "lg", padding: "48px", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0.1, 0.1, 0.1, 0.1)" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "34px", fontFamily: "Poppins, sans-serif" }}>Supplier's Email</h1>
        </div>
        <div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Email address</label>
            <input
              type="email"
              placeholder="Supplier's Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Subject</label>
            <input
              type="text"
              placeholder="Enter the subject here"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
            />
          </div>
          {/* New input fields */}
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: "1", marginRight: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Product ID</label>
              <input
                type="text"
                placeholder="Enter product ID..."
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
              />
            </div>
            <div style={{ flex: "1", marginLeft: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Sizes</label>
              <input
                type="text"
                placeholder="Enter sizes..."
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: "1", marginRight: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Colors</label>
              <input
                type="text"
                placeholder="Enter colors..."
                value={colors}
                onChange={handleColorsChange}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", borderColor: colorError ? 'red' : '#CBD5E0' }}
              />
              {colorError && <p style={{ color: 'red', marginTop: '5px' }}>{colorError}</p>}
            </div>
            <div style={{ flex: "1", marginLeft: "8px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Quantity</label>
              <input
                type="text"
                placeholder="Enter quantity..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
              />
            </div>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Price : RS</label>
            <input
              type="text"
              placeholder="Enter price..."
              value={price}
              onChange={handlePriceChange}
              style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", borderColor: priceError ? 'red' : '#CBD5E0' }}
            />
            {priceError && <p style={{ color: 'red', marginTop: '5px' }}>{priceError}</p>}
          </div>
          {/* End of new input fields */}
          <div style={{ textAlign: "center" }}>
            <button
              style={{ 
                backgroundColor: "#07223D", 
                color: "#FFFFFF", 
                padding: "12px 24px", 
                fontSize: "18px", 
                borderRadius: "4px", 
                border: "none", 
                cursor: "pointer",
                transition: "background-color 0.3s", // Adding transition
                "&:hover": { backgroundColor: "#2c7bb6" } // Changing background color on hover
              }}
              onClick={handleSendEmail}>Send Email</button>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Place the ToastContainer here */}
    </div>
  );
};

export default EmailStockForm;
