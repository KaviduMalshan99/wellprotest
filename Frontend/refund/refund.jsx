import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './refundNow.css';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook



const Refund = () => {
    const [newRefund, setNewRefund] = useState({ orderId: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State to hold image preview URL
    const [errors, setErrors] = useState({}); // Initialize errors state
    const navigate = useNavigate();

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
      
    //     if (name === 'refundDate') {
    //       const selectedDate = new Date(value);
    //       const currentTime = new Date();
          
    //       selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes());
      
    //       setNewRefund((prevRefund) => ({
    //         ...prevRefund,
    //         [name]: selectedDate
    //       }));
    //     } else {
    //       setNewRefund((prevRefund) => ({
    //         ...prevRefund,
    //         [name]: value
    //       }));
    //     }
    //   };
      
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
        setErrors(errors); // Set errors state
        return errors;
    };

    // const handleChangeImage = (event) => {
    //     const imageFile = event.target.files[0];
    //     setSelectedImage(imageFile);

    //     setImagePreview(URL.createObjectURL(imageFile));

    // };

    const handleChangeImage = (event) => {
        const imageFile = event.target.files[0]; // Get the first selected image
    
        const reader = new FileReader(); // Create a FileReader instance
        reader.onload = () => {
            // Convert the selected image to a base64 string
            const base64String = reader.result;
            setImagePreview(base64String);

            console.log("Selected Image:", imageFile.name); // Log the image filename
            console.log("Base64 Encoded Image:", base64String); // Log the base64 encoded image data (for debugging)
    
            // Update the newRefund state with the base64 string
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
        const errors = validateForm(); // Validate form
        if (Object.keys(errors).length === 0) {
            // Get the current date and time
            const currentDate = new Date();
            
            // Convert the current date and time to Sri Lankan time
            const options = {
                timeZone: 'Asia/Colombo', // Sri Lankan timezone
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };
            const sriLankanDateTime = currentDate.toLocaleString('en-US', options);
            
            // Set the Sri Lankan date and time in the new refund object
            setNewRefund((prevRefund) => ({
              ...prevRefund,
              refundDate: sriLankanDateTime
            }));
    
            axios.post('http://localhost:3001/api/addrefund', newRefund)
                .then(response => {
                    toast.success('Refund added successfully!');
                    setNewRefund({ orderId: '', customerName: '', customerEmail: '', reason: '', imgUrls: [] });
                    navigate(`/refundedit/${newRefund.orderId}`); // Navigate to refund edit page with order ID
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
                <Link to='/refundpolicy'><button className="transparent-button" >
                    Refund Policy
                </button></Link>
                {" | "}
                <Link to='/refund'><button className="transparent-button" >
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
                                    </td>
                                </tr>
                                <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Reason</div>
                                    </td>
                                    <td>
                                        <textarea className="rn2mconreastyp" name="reason"  placeholder="Enter Reason" value={newRefund.reason} onChange={handleInputChange} required></textarea>
                                    </td>
                                </tr>
                                {/* <tr className="rnmconttd">
                                    <td className="rnmconttd">
                                        <div className="rnmcontit">Refund Initiate Date</div>
                                    </td>
                                    <td className="rnmconttd">
                                        <input type="date" className="rnmconinp" name="refundDate" value={newRefund.refundDate ? newRefund.refundDate.toISOString().substr(0, 10) : ''} onChange={handleInputChange} required />
                                    </td>
                                </tr> */}
                                <tr className="rnmconttd">
                                     <td className="rnmconttd">
                                         <div className="rnmcontit">Add Image</div>
                                     </td>
                                     <td>
                                         <input type="file" accept='image/*' className="rn2mconaddimg" onChange={handleChangeImage} />
                                         {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />} {/* Display image preview */}

                                     </td>
                                     
                                 </tr>
                            </tbody>
                        </table>
                        <center><button type="submit" className="regbtnr">Submit</button></center>
                    </form>
                </div>
                
            </center>
            <ToastContainer />
        </div>
    );
};

export default Refund;
