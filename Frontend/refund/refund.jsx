import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './refundNow.css';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Refund = () => {
    const [newRefund, setNewRefund] = useState({ orderId: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRefund((prevRefund) => ({
            ...prevRefund,
            [name]: value
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!newRefund.orderId.trim()) {
            errors.orderId = "Order ID is required";
        }
        if (!newRefund.customerName.trim()) {
            errors.customerName = "Customer Name is required";
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
                    setNewRefund({ orderId: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
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
        <div>
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
                <div className="rnmcont">
                    <form onSubmit={handleAddRefund}>
                        <table className="rnmcon">
                            <tbody>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Order ID</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="text" className="rnmconinp" name="orderId" placeholder="Enter ID" value={newRefund.orderId} onChange={handleInputChange} required/>
                                        {errors.orderId && (
                                          <div className="error-messager">{errors.orderId}</div>
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
