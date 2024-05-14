import  { useState, useEffect } from 'react'; // Add useEffect import
import { useLocation,useNavigate  } from 'react-router-dom';
import './paymentscss.scss';
import axios from 'axios';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import cod from '../../src/assets/cod.png'
import koko from '../../src/assets/koko.png'
import Webxpay from '../../src/assets/Webxpay-logo.jpg'
import {useAuthStore} from "../../src/store/useAuthStore"
import { useCheckout } from '../../Frontend/order/CheckoutContext';
import { createRoot } from 'react-dom/client';
import Letterhead from './Letterhead';  
import OrderConfirmationModal from './Modal';
import {PropagateLoader} from 'react-spinners';
import LOGOO from '../../src/assets/logoorange.png'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quantity = parseInt(queryParams.get('quantity'), 10);
  const price = parseFloat(queryParams.get('price'));
  const [orderPlaced, setOrderPlaced] = useState(false); // Ensure this state is correctly declared
  const [loading,setLoading] = useState(true);
  const {user} =useAuthStore();
  const { checkoutData } = useCheckout();
  const navigate = useNavigate();

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
  
  const handleDownloadPDF = async () => {
    const orderData = {
      ...formData,
      customer: user?.UserId,
      id: checkoutData.id,
      ProductName: checkoutData.ProductName,
      quantity: checkoutData.quantity,
      size: checkoutData.size,
      color: checkoutData.color,
      price: checkoutData.price,
      image: checkoutData.image,
      couponCode: couponCode,  // Include coupon code
      discount: discount,
      total: subtotal + (selectedShippingMethod ? selectedShippingMethod.price : 0) + discount
    };

    const element = document.createElement("div");
    document.body.appendChild(element);

    const root = createRoot(element);
    root.render(<Letterhead order={orderData} />);

    setTimeout(async () => {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('order-confirmation.pdf');

      ReactDOM.unmountComponentAtNode(element);
      document.body.removeChild(element);
    }, 500);
  };

  const handleContinueShopping = () => {
    navigate('/');  // Adjust the path as necessary
  };
  useEffect(() => {
    console.log("Received checkout data:", checkoutData); 
    setTimeout(() => setLoading(false),2000);
    if (!checkoutData.id) {
      console.log("No data found, redirecting...");  // Debug log
      navigate('/');
    }
  }, [checkoutData, navigate]);

  const userId = user?.UserId;
  console.log("customerid: ",userId);
  


  const [formData, setFormData] = useState({
    country: '',
    email: '',
    firstName: '',
    lastName: '',
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




const handleProceedClick = async () => {
  setIsLoading(true); // Start loading

  // Validate all fields first
  const newErrors = {};
  Object.keys(formData).forEach(key => {
    validateField(key, formData[key]);  // This will update the error state
    if (errors[key]) {
      newErrors[key] = errors[key];
    }
  });

  // Check for valid contact number
  const isValidContactNumber = countryContactNumberRegex[formData.country]?.test(formData.contactNumber);
  if (!isValidContactNumber) {
    newErrors.contactNumber = `Please enter a valid contact number for ${formData.country}.`;
  }

  // Check for valid postal code
  const isValidPostalCode = countryCitiesAndPostalCodes[formData.country]?.[formData.city]?.test(formData.postalCode);
  if (!isValidPostalCode) {
    newErrors.postalCode = `Please enter a valid postal code for ${formData.city}.`;
  }

  // Set any new errors found during this process
  setErrors(newErrors);

  // If there are any errors, do not proceed with order processing
  if (Object.keys(newErrors).length > 0) {
    toast.error('Please correct the errors before submitting.');
    setIsLoading(false); // Stop loading if there are errors
    return;
  }

  // No errors, proceed with the order
  try {
    const orderData = {
      ...formData,
      customerId: user?.UserId,
      id: checkoutData.id,
      ProductName: checkoutData.ProductName,
      quantity: checkoutData.quantity,
      size: checkoutData.size,
      color: checkoutData.color,
      price: checkoutData.price,
      image: checkoutData.image,
      couponCode: couponCode,  // Include coupon code
      discount: discount,
      total: subtotal + (selectedShippingMethod ? selectedShippingMethod.price : 0) + discount
    };

    // Simulating a network request with a delay
    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/addOrder', orderData);
        toast.success("Order placed successfully");
        setOrderPlaced(true);
        if (couponCode) {
          try {
            const deactivationResponse = await axios.post('http://localhost:3001/api/deactivateCoupon', { code: couponCode });
            toast.info('Coupon deactivated');
          } catch (deactivationError) {
            toast.error('Failed to deactivate coupon');
          }
        }
        // Optionally, generate a PDF after order confirmation
        generatePDF(orderData);
      } catch (error) {
        // toast.error('Error submitting order: ' + (error.response ? error.response.data.error : error.message));
      }
      setIsLoading(false);
    }, 2000);
  } catch (error) {
    toast.error("Failed to process order: " + error.message);
    setIsLoading(false);
  }
};




const validateOrderData = () => {
  const requiredFields = ['productName', 'productId', 'quantity', 'price', 'size', 'color'];
  for (let field of requiredFields) {
      if (!checkoutData[field]) {
          console.error(`Validation error: Missing ${field}`);
          return false;
      }
  }
  return true;
};

useEffect(() => {
  axios.get('http://localhost:3001/api/shippingMethods')
    .then(response => {
      setShippingMethods(response.data);
      if (response.data.length > 0) {
        const firstMethod = response.data[0];
        setSelectedShippingMethod(firstMethod);
        setFormData(prev => ({ ...prev, shippingMethod: firstMethod.methodName }));
        updateTotal(checkoutData.price * checkoutData.quantity, firstMethod.price);
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
      toast.error('Invalid or expired coupon');
    }
  };


return(
  <>
  <Header/>
  {loading && (
    <div className="loader-container">
      <div className="loader-overlay">
        <img src={LOGOO} alt="Logo" className="loader-logo" />
        <PropagateLoader color={'#ff3c00'} loading={true} />
      </div>
    </div>
  )}

    {!loading && (
      
  <div className="checkout-container">
    
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
      <input 
      type="tel"
      name="contactNumber"
      placeholder={formData.country ? `Enter contact number (${getCountryCode(formData.country)})` : 'Select a country first'}
      value={getCountryCode(formData.country) + formData.contactNumber}
      onChange={handleInputChange}
      required
      inputMode="numeric"
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
    <div className="additional-details">
      <button onClick={toggleAdditionalDetails} className="details-button">+</button>
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
    <hr />
    <h2 className="section-title">Shipping Method</h2>
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
        <h2 className="section-title">Payment Method</h2>
        <div className={`payment-method ${expandedPayment === 'koko' ? 'expanded' : ''}`} onClick={() => handleExpandPayment('koko')}>
          <div className="method-title">
            <input type="radio" id="koko" name="paymentMethod" />
            <label htmlFor="koko">Koko | Buy Now Pay Later</label>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
          <div className="expand-content">
            <img src={koko} alt="Product" />
            <p>Upon selecting Proceed, you will be directed to Koko: Buy Now Pay Later to securely finalize your purchase.</p>
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
            <p>Upon selecting Proceed, you will be redirected to WEBXPAY for a secure completion of your purchase.</p>
          </div>
        </div>
        <div className={`payment-method ${expandedPayment === 'cod' ? 'expanded' : ''}`} onClick={() => handleExpandPayment('cod')}>
          <div className="method-title">
            <input type="radio" id="cod" name="paymentMethod" />
            <label htmlFor="cod">Cash on Delivery</label>
            {errors.paymentMethod && <p className="error">{errors.paymentMethod}</p>}
          </div>
          <div className="expand-content">
          <img src={cod} alt="Product"  style={{height:'150px',width:'400px'}}/>
            <p>Pay with cash upon delivery of your order.</p>
          </div>
        </div>
        <div className="coupon-code">
          <h2 className="section-title">Coupon Code/Gift Card</h2>
          <div className="form-group half-width">
            <label>Coupon Code:</label>
            <input type="text" value={couponCode} onChange={handleCouponCodeChange} />
          </div>
          <button className="apply-btn" onClick={applyCoupon}>Apply</button>
        </div>

      </div>
      <div className="order-summary" id="order-summary">
  <h2>Order Summary</h2>
  <div className="product-summary">
  <div className="product-image-container">
    <img src={checkoutData.image[0]} alt={checkoutData.ProductName} />
    <div className="quantity-badge">{checkoutData.quantity}</div>
  </div>
  <div className="product-details">
    <div className="title-and-price">
      <h2>{checkoutData.ProductName}</h2>
      <span className="price">LKR {checkoutData.price}.00</span>
    </div>
    <div className="attributes">
      <span className="size">{checkoutData.size}</span>
      <span className="color">{checkoutData.color}</span>
    </div>
    <div className="subtotal">
      <span>Subtotal</span>
      <span>LKR {subtotal.toFixed(2)}</span>
    </div>
  </div>
</div>

  <div className="order-costs">
    <p><span>Shipping:</span> <span className="right-align">LKR {selectedShippingMethod ? selectedShippingMethod.price.toFixed(2) : '0.00'}</span></p>
    <p><span>Discount:</span> <span className="right-align">LKR {discount.toFixed(2)}</span></p>
    <p><span>Total:</span> <span className="right-align">LKR {total.toFixed(2)}</span></p>
  </div>
  <div className='error'>
          {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
        </div>
        <button className='proceed-btn' onClick={handleProceedClick} disabled={isLoading || orderPlaced}>
        {isLoading ? "Processing..." : "Proceed"}
      </button>
    </div>
{orderPlaced && (
                <OrderConfirmationModal
                    onContinue={handleContinueShopping}
                    onDownload={handleDownloadPDF}
                />
            )}
</div>
  )}
  <Footer/>
  <ToastContainer/>

  </>
)
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
