import React, { useState, useEffect } from 'react'; // Add useEffect import
import { useLocation,Link } from 'react-router-dom';
import './paymentscss.scss';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import koko from '../../src/assets/koko.png'
import Webxpay from '../../src/assets/Webxpay-logo.jpg'




function Checkout() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('UserId');
  const productName = queryParams.get('Productname');
  const productId = queryParams.get('id');
  const quantity = parseInt(queryParams.get('quantity'), 10);
  const size = queryParams.get('size');
  const price = parseFloat(queryParams.get('price'));
  const image = decodeURIComponent(queryParams.get('image'));
  const color = queryParams.get('color');
  const [errors, setErrors] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [additionalDetailsExpanded, setAdditionalDetailsExpanded] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [discount, setDiscount] = useState(0);  // default discount
  const [total, setTotal] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);


  const [formData, setFormData] = useState({
    country: '',
    email: '',
    firstName: '',
    firstName: '',
    contactNumber: '',
    State: '',
    address: '',
    address02: '',
    city: '',
    postalCode: '',
    additionalDetails: '',
    shippingMethod: '',
    paymentMethod: '',
    couponCode: '',
    saveAsDefault: false 
  });


  const updateTotal = (newSubtotal, shippingPrice) => {
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shippingPrice);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'contactNumber' ? value.replace(getCountryCode(formData.country), '') : value
    }));
    validateField(name, value);  // Validate field immediately on change
  };

  const validateField = (name, value) => {
    let errorMsg = {};
    let valid = true;

    switch (name) {
        case 'country':
            if (!['Sri Lanka', 'USA', 'India'].includes(value)) {
                errorMsg.country = 'Please select a valid country.';
                valid = false;
            }
            break;
        case 'email':
            if (!/\S+@\S+\.\S+/.test(value)) {
                errorMsg.email = 'Invalid email format.';
                valid = false;
            }
            break;
        case 'firstName':
        case 'lastName':
        case 'State':
        case 'city':
        case 'postalCode':
        case 'contactNumber':
        case 'address':
            if (!value.trim()) {
                errorMsg[name] = `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required.`;
                valid = false;
            }
            break;
        case 'paymentMethod':
            if (!value) {
                errorMsg.paymentMethod = 'Please select a payment method.';
                valid = false;
            }
            break;
        case 'shippingMethod':
            if (!value) {
                errorMsg.shippingMethod = 'Shipping method is required.';
                valid = false;
            }
            break;
        case 'productName':
            if (!value) {
                errorMsg.productName = 'Product name is required.';
                valid = false;
            }
            break;
        case 'productId':
            if (!value) {
                errorMsg.productId = 'Product ID is required.';
                valid = false;
            }
            break;
        case 'quantity':
            if (value <= 0 || isNaN(value)) {
                errorMsg.quantity = 'Quantity must be greater than zero.';
                valid = false;
            }
            break;
        case 'price':
            if (value <= 0 || isNaN(value)) {
                errorMsg.price = 'Price must be greater than zero.';
                valid = false;
            }
            break;
        case 'total':
            if (value <= 0 || isNaN(value)) {
                errorMsg.total = 'Total must be calculated and greater than zero.';
                valid = false;
            }
            break;
    }

    if (valid) {
        // Remove any existing errors for this field if validation passes
        setErrors(prevErrors => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[name];
            return updatedErrors;
        });
    } else {
        // Add or update errors object with new error message
        setErrors(prevErrors => ({ ...prevErrors, ...errorMsg }));
    }
};

  const handleExpandPayment = (method) => {
    setFormData(prevState => ({
        ...prevState,
        paymentMethod: method
    }));
    validateField('paymentMethod', method);  // Revalidate when a method is selected
    setExpandedPayment(method === expandedPayment ? null : method);
};

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const countryContactNumberRegex = {
    'Sri Lanka': /^\d{9}$/,
    'USA': /^\d{10}$/,
    'India': /^\d{10}$/
};

const handleProceedClick = async () => {

  const newErrors = {};
  Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);  // This will update the error state
      if (errors[key]) {  // Check if there are existing errors
          newErrors[key] = errors[key];
      }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    alert('Please correct the errors before submitting.');
    return;
}
  const contactNumberWithCode = getCountryCode(formData.country) + formData.contactNumber;
  const isValidContactNumber = countryContactNumberRegex[formData.country]?.test(formData.contactNumber);
  if (!isValidContactNumber) {
      setErrors(errors => ({ ...errors, contactNumber: `Please enter a valid contact number for ${formData.country}.` }));
      return;
  }

    // Assuming you also have similar definitions for postal codes
    const countryCitiesAndPostalCodes = {
      'Sri Lanka': {
          'Colombo': /^\d{5}$/,
          'Galle': /^\d{5}$/,
          'Kandy': /^\d{5}$/,
          'Jaffna': /^\d{5}$/,
          'Anuradhapura': /^\d{5}$/,
          'Trincomalee': /^\d{5}$/,
          'Badulla': /^\d{5}$/
      },
      'USA': {
          'New York': /^\d{5}(-\d{4})?$/,
          'Los Angeles': /^\d{5}(-\d{4})?$/,
          'Chicago': /^\d{5}(-\d{4})?$/,
          'Houston': /^\d{5}(-\d{4})?$/,
          'Phoenix': /^\d{5}(-\d{4})?$/,
          'Philadelphia': /^\d{5}(-\d{4})?$/,
          'San Antonio': /^\d{5}(-\d{4})?$/
      },
      'India': {
          'Mumbai': /^\d{6}$/,
          'Delhi': /^\d{6}$/,
          'Bangalore': /^\d{6}$/,
          'Hyderabad': /^\d{6}$/,
          'Ahmedabad': /^\d{6}$/,
          'Chennai': /^\d{6}$/,
          'Kolkata': /^\d{6}$/
      }
  };
  

    const isValidPostalCode = countryCitiesAndPostalCodes[formData.country]?.[formData.city]?.test(formData.postalCode);
    if (!isValidPostalCode) {
        setValidationError(`Please enter a valid postal code for ${formData.city}.`);
        return;
    }


    if (Object.keys(errors).every(key => !errors[key])) {
        const orderData = {
            ...formData,
            contactNumber: getCountryCode(formData.country) + formData.contactNumber,
            customerId: customerId,
            productName: productName,
            productId: productId,
            quantity: quantity,
            size: size,
            color: color,
            price: price,
            total: total.toFixed(2),
            imageUrl: image,
            couponCode: couponCode 
        };

        try {
            const response = await axios.post('http://localhost:3001/api/addOrder', orderData);
            console.log("Order placed successfully", response.data);
            setValidationError('');
            setOrderPlaced(true); // Set order placed to true on success
            // Optionally clear the form or redirect the user
        } catch (error) {
            console.error('Error submitting order:', error);
            setValidationError('Failed to submit order, please try again.');
        }
    } else {
        alert('Please correct the errors before submitting.');
    }
};

useEffect(() => {
  axios.get('http://localhost:3001/api/shippingMethods')
    .then(response => {
      setShippingMethods(response.data);
      if (response.data.length > 0) {
        const firstMethod = response.data[0];
        setSelectedShippingMethod(firstMethod);
        setFormData(prev => ({ ...prev, shippingMethod: firstMethod.methodName }));
        updateTotal(price * quantity, firstMethod.price);
      }
    })
    .catch(err => console.error('Failed to fetch shipping methods', err));
}, [price, quantity]);

const handleShippingChange = (method) => {
  setSelectedShippingMethod(method);
  setFormData(prev => ({ ...prev, shippingMethod: method.methodName }));
  updateTotal(subtotal, method.price);
};
  

  const toggleAdditionalDetails = () => {
    setAdditionalDetailsExpanded(!additionalDetailsExpanded);
  };

  const countries = ['Sri Lanka','USA', 'India'];

  const applyCoupon = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/validateCoupon', { code: couponCode, country: formData.country });
        if (response.data) {
            const { discountType, discountValue } = response.data;
            let newDiscount = discountType === 'PERCENTAGE' ? (subtotal * discountValue / 100) : discountValue;
            setDiscount(-newDiscount);  // Ensure discount is subtracted
            setTotal((prevTotal) => prevTotal - newDiscount);  // Correctly update the total
        }
    } catch (error) {
        alert('Invalid or expired coupon');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Product Name", "Quantity", "Size", "Color", "Total"];
    const tableRows = [];

    // Single row for now; modify as necessary
    tableRows.push([
        productName,
        quantity,
        size,
        color,
        `LKR ${total.toFixed(2)}`
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Order Details", 14, 15);
    doc.save(`order_${new Date().getTime()}.pdf`);
};

  return (
    
    <div className="checkout-container">
            <Link to="/Men"><button type="button" className='bt01' >Home page</button></Link>

      <div className="form-section">
        <h2>Shipping Address</h2>
        <div className="form-group">
          <select name="country" value={formData.country} onChange={handleInputChange}>
            <option value="">Select Country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder='Email' value={formData.email} onChange={handleInputChange} required />
          <p className="email-notice">This email will be used to send order confirmations and tracking updates.</p>
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="name-group">
          <div className="form-group half-width">
            <input type="text" name="firstName" placeholder='First Name' value={formData.firstName} onChange={handleInputChange} required />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
          <div className="form-group half-width">
            <input type="text" name="lastName" placeholder='Last Name' value={formData.lastName} onChange={handleInputChange} required />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>
        </div>
        <div className="form-group">
          {/* Render input field with country code dynamically */}
          <input 
          type="tel"
          name="contactNumber"
          placeholder={formData.country ? `Enter contact number (${getCountryCode(formData.country)})` : 'Select a country first'}
          value={getCountryCode(formData.country) + formData.contactNumber}
          onChange={handleInputChange}
          required
          inputMode="numeric" // Ensures a numeric keyboard is displayed on mobile devices
        />
        {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}

        </div>
        <div className="form-group">
          <input type="text" name="State" placeholder='State / Province' value={formData.State} onChange={handleInputChange} required />
          {errors.State && <p className="error">{errors.State}</p>}
        </div>
        <div className="form-group">
          <input type="text" name="address" placeholder='Address' value={formData.address} onChange={handleInputChange} required />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div className="form-group">
          <input type="text" name="address02" placeholder='Address-line 02 (Apartment,suite,etc.)' value={formData.address2} onChange={handleInputChange} />
          {errors.address02 && <p className="error">{errors.address02}</p>}
        </div>
        <div className="name-group">
          <div className="form-group half-width">
            <input type="text" name="city" placeholder='City' value={formData.city} onChange={handleInputChange} required />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>
          <div className="form-group half-width">
            <input type="text" name="postalCode" placeholder='Postal Code' value={formData.postalCode} onChange={handleInputChange} required />
            {errors.postalCode && <p className="error">{errors.postalCode}</p>}
          </div>
        </div>
        <div className='error'>
          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
        </div>
        <div className="additional-details">
          <button onClick={toggleAdditionalDetails}>+</button>
          <span>Add Additional Details</span>
        </div>
        {additionalDetailsExpanded && (
          <div className="form-group">
            <textarea
              name="additionalDetails"
              placeholder="Additional Details"
              value={formData.additionalDetails}
              onChange={handleInputChange}
            ></textarea>
          </div>
        )}
        {/* <div className="save-as-default">
          <input type="checkbox" id="saveAsDefault" name="saveAsDefault" checked={formData.saveAsDefault} onChange={handleCheckboxChange} required />
          <label htmlFor="saveAsDefault">Save as default</label>
        </div> */}
        <hr />
        <h2>Shipping Method</h2>
      <div className="shipping-method">
        {shippingMethods.map(method => (
          <div className="method" key={method._id}>
            <input type="radio"
              id={method._id}
              name="shippingMethod"
              checked={formData.shippingMethod === method.methodName}
              onChange={() => handleShippingChange(method)}
              required />
            <label htmlFor={method._id}>{method.methodName} - LKR {method.price.toFixed(2)}</label>
          </div>
        ))}
      </div>
        <h2>Payment Method</h2>
        <div className={`payment-method ${expandedPayment === 'koko' ? 'expanded' : ''}`} onClick={() => handleExpandPayment('koko')}>
          <div className="method-title">
            <input type="radio" id="koko" name="paymentMethod" />
            <label htmlFor="koko">Koko | Buy Now Pay Later</label>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
          <div className="expand-content">
            <img src={koko} alt="Product" />
            <p>Upon selecting "Proceed," you will be directed to Koko: Buy Now Pay Later to securely finalize your purchase.</p>
          </div>
        </div>
        <div className={`payment-method ${expandedPayment === 'webxpay' ? 'expanded' : ''}`} onClick={() => handleExpandPayment('webxpay')}>
          <div className="method-title">
            <input type="radio" id="webxpay" name="paymentMethod" />
            <label htmlFor="webxpay">WEBXPAY</label>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
          <div className="expand-content">
            <img src={Webxpay} alt="Product"  style={{height:'150px',width:'400px'}}/>
            <p>Upon selecting "Proceed," you will be redirected to WEBXPAY for a secure completion of your purchase.</p>
          </div>
        </div>
        <div className={`payment-method ${expandedPayment === 'cod' ? 'expanded' : ''}`} onClick={() => handleExpandPayment('cod')}>
          <div className="method-title">
            <input type="radio" id="cod" name="paymentMethod" />
            <label htmlFor="cod">Cash on Delivery</label>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
          <div className="expand-content">
            <img  alt="Product" />
            <p>Pay with cash upon delivery of your order.</p>
          </div>
        </div>
        <div className="coupon-code">
          <h2>Coupon Code/Gift Card</h2>
          <div className="form-group">
            <label>Coupon Code:</label>
            <input type="text" value={couponCode} onChange={handleCouponCodeChange} />
          </div>
          <button className="apply-btn" onClick={applyCoupon}>Apply</button>
        </div>

      </div>
      <div className="order-summary">
      <h2>Order Summary</h2>
      <div className="product-item">
          <div className="product-image-container">
            <img src={image} alt="Product" className="product-image" />
            <div className="quantity-badge">{quantity}</div>
          </div>
          <div className="product-info">
            <div className="product-details">
              <span className="product-name">{productName}</span>
              <span className="product-price">LKR {price.toFixed(2)}</span>
            </div>
            <div className="product-meta">
              <p>{color}</p>
              <p>{size}</p>
            </div>
            <p className="product-subtotal">Subtotal <span className="mar">LKR {subtotal.toFixed(2)}</span></p>

          </div>
        </div>
        <div className="order-costs">
        <p><span>Shipping:</span> <span className="right-align">LKR {selectedShippingMethod ? selectedShippingMethod.price.toFixed(2) : '0.00'}</span></p>
        <p><span>Discount:</span> <span className="right-align">LKR {discount.toFixed(2)}</span></p>
        <p><span>Total:</span> <span className="right-align">LKR {total.toFixed(2)}</span></p>
        </div>
        <button type="button" className="proceed-btn" onClick={handleProceedClick}>Proceed</button>
      </div>

    </div>
    
  );
}

export default Checkout;

// Function to get country code based on selected country
function getCountryCode(country) {
  switch (country) {
    case 'Sri Lanka': return '+94';
    case 'USA': return '+1';
    case 'India': return '+91';
    default: return '';
  }
}
