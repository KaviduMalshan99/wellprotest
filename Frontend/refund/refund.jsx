import React, { useState } from 'react';
import Footer from '../Footer/Footer'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './refundNow.scss';
import { useNavigate, Link } from 'react-router-dom';

import Header from '../Header/Header';


const Refund = () => {
    const [newRefund, setNewRefund] = useState({ orderId: '',  id: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
      
        if (name === 'refundDate') {
          const selectedDate = new Date(value);
          const currentTime = new Date();
          
          selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes());
      
          setNewRefund((prevRefund) => ({
            ...prevRefund,
            [name]: selectedDate
          }));
        } else if (name === 'customerName') {
          // Validate customer name to allow only letters and spaces
          const isValid = /^[a-zA-Z\s]*$/.test(value);
          if (!isValid) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: 'Only letters and spaces are allowed',
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [name]: '',
            }));
          }
          setNewRefund((prevRefund) => ({
            ...prevRefund,
            [name]: value
          }));
        } else {
          setNewRefund((prevRefund) => ({
            ...prevRefund,
            [name]: value
          }));
        }
      };

    const validateForm = () => {
        const errors = {};
        const orderIdRegex = /^[a-zA-Z0-9]+$/; // Regex pattern for characters and numbers
        const customerNameRegex = /^[a-zA-Z0-9\s]+$/; // Regex pattern for characters, numbers, and spaces
    
        if (!newRefund.orderId.trim()) {
            errors.orderId = "Order ID is required";
        } else if (!orderIdRegex.test(newRefund.orderId)) {
            errors.orderId = "Order ID must contain only characters and numbers";
        }
    
        if (!newRefund.customerName.trim()) {
            errors.customerName = "Customer Name is required";
        } else if (!customerNameRegex.test(newRefund.customerName)) {
            errors.customerName = "Customer Name must contain only characters, numbers, and spaces";
        }
    
        if (!newRefund.customerEmail.trim()) {
            errors.customerEmail = "Customer Email is required";
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newRefund.customerEmail)) {
            errors.customerEmail = "Invalid email format";
        }
    
        if (!newRefund.reason.trim()) {
            errors.reason = "Reason is required";
        }
    
        setErrors(errors);
        return errors;
    };
    

    const handleChangeImage = (event) => {
        const imageFile = event.target.files[0]; // Get the first selected image
    
        const reader = new FileReader(); // Create a FileReader instance
        reader.onload = () => {
            const base64String = reader.result;
            setImagePreview(base64String);
            setNewRefund({
                ...newRefund,
                imgUrls: [base64String]
            });
        };
        reader.readAsDataURL(imageFile); // Read the selected image as a data URL (base64 encoded)
    };
    
    const handleAddImage = () => {
        if (selectedImage) {
            setNewRefund({
                ...newRefund,
                imgUrls: [...newRefund.imgUrls, URL.createObjectURL(selectedImage)]
            });
            setSelectedImage(null);
            setImagePreview(null); // Clear image preview after adding
        }
    };

    const handleAddRefund = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            axios.post('http://localhost:3001/api/addrefund', newRefund)
                .then(response => {
                    toast.success('Refund added successfully!');
                    setNewRefund({ orderId: '', id: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
                    navigate(`/refundedit/${newRefund.orderId}`);
                })
                .catch(error => {
                    console.error('Error adding refund: ', error);
                    toast.error('Error adding refund. Please try again.');
                });
        } else {
            toast.error('Please fill out all required fields correctly.');
        }
    };

    return (
        <div id = 'refund-main' >
        <Header/>
            <div className="rnmh">Refund</div>
            <div className="rnlp">Home &gt; Refund</div>
            <div className="rnmbtns">

                <Link to='/refundpolicy'><button id="transparent-buttonr" >
                    Refund Policy
                </button></Link>
                <div className='ira'>{" | "}</div>
                <Link to='/refund'><button id="transparent-buttonr" >

                    Refund Now
                </button></Link>
            </div>
            <center>
                <div id="rnmcont">
                    <form onSubmit={handleAddRefund}>
                        <table className="rnmcon">
                            <tbody>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Order ID</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="text" className="rnmconinp" name="orderId" placeholder="Enter Order ID" value={newRefund.orderId} onChange={handleInputChange} required/>
                                        {errors.orderId && (
                                          <div className="error-message">{errors.orderId}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Product ID</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="text" className="rnmconinp" name="id" placeholder="Enter Product ID" value={newRefund.id} onChange={handleInputChange} required/>
                                        {errors.id && (
                                          <div className="error-messager">{errors.id}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Customer Name</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="text" className="rnmconinp" name="customerName" placeholder="Enter Name" value={newRefund.customerName} onChange={handleInputChange} required/>
                                        {errors.customerName && (
                                          <div className="error-messager">{errors.customerName}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Customer Email</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="email" className="rnmconinp" name="customerEmail" placeholder="Enter Email" value={newRefund.customerEmail} onChange={handleInputChange} required/>
                                        {errors.customerEmail && (
                                          <div className="error-messager">{errors.customerEmail}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Reason</div>
                                    </td>
                                    <td>
                                        <textarea className="rn2mconreastyp" name="reason"  placeholder="Enter Reason" value={newRefund.reason} onChange={handleInputChange} required></textarea>
                                        {errors.reason && (
                                          <div className="error-messager">{errors.reason}</div>
                                        )}
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Add Image</div>
                                    </td>
                                    <td>
                                        <input type="file" accept='image/*' className="rn2mconaddimg" onChange={handleChangeImage} />
                                        {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <center><button type="submit" className="regbtnr">Submit</button></center>
                    </form>
                </div>
            </center>
            <Footer/>
            <ToastContainer />
        </div>
    );
};

export default Refund;
