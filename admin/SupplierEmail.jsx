import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailStockForm = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [productId, setProductId] = useState('');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [colorError, setColorError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [quantityErrorMsg, setQuantityErrorMsg] = useState('');
  const navigate = useNavigate();

  const defaultText = "Dear Mr/Miss;\n\nThere is a quick supply needed .I want that supply order from you . The details attached the below fields of this message. Give me the quick response form you.\n\nIf you have any concern of this. Please let us know.\n\nThank You\n\n";
  const [message, setMessage] = useState(defaultText);

  const handleSendEmail = async () => {
    const emailData = {
      message: message,
      email,
      subject,
      productId,
      sizes,
      colors,
      quantity,
      price
    };

    try {
      await axios.post('http://localhost:3001/send-email', emailData);
      toast.success('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('There was an error sending the email. Please try again later.');
    }
  };

  const handleColorsChange = (e, index) => {
    const updatedColors = [...colors];
    updatedColors[index] = e.target.value;
    setColors(updatedColors);
    setColorError('');
  };

  const handleAddColor = () => {
    setColors([...colors, '']);
  };

  const handleRemoveColor = (index) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    setColors(updatedColors);
  };

  const handlePriceChange = (e) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(e.target.value) || e.target.value === '') {
      setPrice(e.target.value);
      setPriceError('');
    } else {
      setPriceError('Type only numbers');
    }
  };

  const handleQuantityChange = (e) => {
    const regex = /^[0-9\s]*$/;
    if (regex.test(e.target.value) || e.target.value === '') {
      setQuantity(e.target.value);
      setQuantityErrorMsg('');
    } else {
      setQuantityErrorMsg('Type only numbers');
    }
  };

  const handleAddSize = () => {
    setSizes([...sizes, '']);
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };

  const handleRemoveSize = (index) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(index, 1);
    setSizes(updatedSizes);
  };

  return (
    <div>
      <div className="emailtopicpath" style={{ fontSize: "35px", marginTop: "40px", marginLeft: "1px", textAlign: "center", fontWeight: "600" }}>
        Existing Supplier/Email Section
      </div>
      <button onClick={() => navigate('/admin/supplier')}
        style={{ width: "20%", top: "14%", left: "25%", marginTop: "20px", backgroundColor: "#07223D", color: "#FFFFFF", padding: "12px 24px", fontSize: "18px", borderRadius: "10px", border: "none", cursor: "pointer" }}
      >
        Back to Suppliers
      </button>
      <div style={{ minHeight: "calc(100vh - 40px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#ebe9e9", marginTop: "35px", marginBottom: "40px" }}>
        <div style={{ maxWidth: "100%", padding: "48px", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0.1, 0.1, 0.1, 0.1)", width: "45%" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "30px", marginBottom: "34px", fontFamily: "Poppins, sans-serif" }}>Supplier's Email</h1>
          </div>
          <div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>Email address</label>
              <input type="email" placeholder="Supplier's Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
              />
            </div>
            <div style={{ display: "flex", marginBottom: "28px" }}>
              <div style={{ flex: "1", marginRight: "8px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Subject</label>
                <input type="text" placeholder="Enter the subject.." value={subject} onChange={(e) => setSubject(e.target.value)}
                  style={{ width: "90%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
                />
              </div>
              <div style={{ flex: "1", marginLeft: "0px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Product ID</label>
                <input type="text" placeholder="Enter product ID.." value={productId} onChange={(e) => setProductId(e.target.value)}
                  style={{ width: "90%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", marginLeft: "10px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "28px" }}>
              <div style={{ flex: "1", marginRight: "8px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Sizes</label>
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {sizes.map((size, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                      <select
                        value={size}
                        onChange={(e) => handleSizeChange(index, e.target.value)}
                        style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0" }}
                      >
                        <option value="">Select Size</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                      </select>
                      <button onClick={() => handleRemoveSize(index)} style={{ color: quantityErrorMsg ? 'red' : 'black' }}>Remove Size</button>
                    </div>
                  ))}
                  <button onClick={handleAddSize}>Add Size</button>
                </div>
              </div>
              <div style={{ flex: "1", marginLeft: "8px" }}>
                <label style={{ display: "block", marginBottom: "28px" }}>Colors</label>
                <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                  {colors.map((color, index) => (
                    <div key={index} style={{ marginBottom: "8px" }}>
                      <input
                        type="text"
                        placeholder="Enter color.."
                        value={color}
                        onChange={(e) => handleColorsChange(e, index)}
                        style={{ width: "100%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", borderColor: colorError ? 'red' : '#CBD5E0' }}
                      />
                      <button onClick={() => handleRemoveColor(index)} style={{ color: colorError ? 'red' : 'black' }}>Remove Color</button>
                    </div>
                  ))}
                  <button onClick={handleAddColor}>Add Color</button>
                </div>
                {colorError && <p style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>{colorError}</p>}
              </div>
            </div>
            <div style={{ display: "flex", marginBottom: "24px" }}>
              <div style={{ flex: "1", marginRight: "8px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Quantity</label>
                <input type="text" placeholder="Enter quantity.." value={quantity} onChange={handleQuantityChange}
                  style={{ width: "90%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", borderColor: quantityErrorMsg ? 'red' : '#CBD5E0' }}
                />
                {quantityErrorMsg && <p style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>{quantityErrorMsg}</p>}
              </div>
              <div style={{ flex: "1", marginLeft: "8px", marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px" }}>Stock Price Range</label>
                <input type="text" placeholder="Enter price.." value={price} onChange={handlePriceChange}
                  style={{ width: "90%", padding: "12px", fontSize: "16px", borderRadius: "10px", border: "1px solid #CBD5E0", borderColor: priceError ? 'red' : '#CBD5E0' }}
                />
                {priceError && <p style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>{priceError}</p>}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button
                style={{ backgroundColor: "#07223D", color: "#FFFFFF", padding: "12px 24px", fontSize: "18px", borderRadius: "10px", border: "none", cursor: "pointer", transition: "background-color 0.3s", "&:hover": { backgroundColor: "#2c7bb6" } }} onClick={handleSendEmail}>Send Email</button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmailStockForm;
