import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './refundEdit.css';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import useParams hook to extract route parameters

const RefundEdit = () => {
  const [newRefund, setNewRefund] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { orderId } = useParams(); // Extract orderId from route parameters
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview URL

  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchRefund = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/refund/${orderId}`);
        setNewRefund(response.data.refund); // Set fetched refund data to newRefund state
      } catch (error) {
        console.error('Error fetching refund:', error);
      }
    };

    fetchRefund();
  }, [orderId]);

  if (!newRefund) {
    return <p>Loading...</p>;
  }

  const handleDelete = (orderId) => {
    axios.delete(`http://localhost:3001/api/deleterefund/${orderId}`)
      .then(res => {
        console.log(res);
        toast.success('Refund deleted successfully!');
        navigate('/refundPolicy'); // Redirect to the refundPolicy page after successful deletion
      })
      .catch(err => {
        console.error('Error deleting refund:', err);
        toast.error('Error deleting refund.');
      });
  };
  
  const handleUpdate = () => {
    axios.put(`http://localhost:3001/api/updaterefund/${orderId}`, newRefund)
      .then(res => {
        console.log(res);
        toast.success('Refund updated successfully!');
        navigate(`/refundedit/${orderId}`); // Redirect to the current page after successful update
      })
      .catch(err => {
        console.error('Error updating refund:', err);
        toast.error('Error updating refund.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'refundDate') {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value ? new Date(value) : null
      }));
    } else {
      setNewRefund((prevRefund) => ({
        ...prevRefund,
        [name]: value
      }));
    }
  };

  // const handleChangeImage = (event) => {
  //   const imageFile = event.target.files[0];
  //   const imageUrl = URL.createObjectURL(imageFile); // Generate URL for the selected image
  //   setNewRefund((prevRefund) => ({
  //     ...prevRefund,
  //     imgUrls: [...prevRefund.imgUrls, imageUrl] // Update imgUrls with the new image URL
  //   }));
  // };
  
  const handleChangeImage = (event) => {
    const imageFile = event.target.files[0]; // Get the first selected image

    const reader = new FileReader(); // Create a FileReader instance
    reader.onload = () => {
        // Convert the selected image to a base64 string
        const base64String = reader.result;
        console.log("Selected Image:", imageFile.name); // Log the image filename
        console.log("Base64 Encoded Image:", base64String); // Log the base64 encoded image data (for debugging)

        // Update the newRefund state with the base64 string
        setNewRefund({
            ...newRefund,
            imgUrls: [...newRefund.imgUrls, base64String]
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
      setSelectedImage(null); // Reset selected image after adding
      setImagePreview(null); // Clear image preview after adding
    }
  };

  const handleRemoveImage = (index) => {
    setNewRefund({
      ...newRefund,
      imgUrls: newRefund.imgUrls.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <div className="rnmh">Refund</div>
      <div className="rnlp">Home &gt; Refund</div>
      <div className="rnmbtns">
        <button id="transparent-buttonr" onClick={() => navigate('/refundPolicy')}>
          Refund Policy
        </button>
        {" | "}
        <button id="transparent-buttonr" onClick={() => navigate(`/`)}>
          Refund Now
        </button>
      </div> 
      <center>
        
          <form>
          <div className="rnmcont">
            <table className="rnmcon">
              <tbody>
                <tr>
                  <td>
                    <div className="rnmcontit">Order ID</div>
                  </td>
                  <td>
                    <input type="text" className="rnmconinp" name="orderId" placeholder="Enter ID" value={newRefund.orderId} onChange={handleInputChange} required/>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Customer Name</div>
                  </td>
                  <td>
                    <input type="text" className="rnmconinp" name="customerName" placeholder="Enter Name" value={newRefund.customerName} onChange={handleInputChange} required/>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Customer Email</div>
                  </td>
                  <td>
                    <input type="email" className="rnmconinp" name="customerEmail" placeholder="Enter Email" value={newRefund.customerEmail} onChange={handleInputChange} required/>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Reason</div>
                  </td>
                  <td>
                    <textarea className="rn2mconreastyp" name="reason"  placeholder="Enter Reason" value={newRefund.reason} onChange={handleInputChange} required></textarea>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Refund Initiate Date</div>
                  </td>
                  <td>
                    <input type="date" className="rnmconinp" name="refundDate" value={newRefund.refundDate ? new Date(newRefund.refundDate).toISOString().substr(0, 10) : ''} onChange={handleInputChange} required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Add Image</div>
                  </td>
                  <td>
                    <input type="file" accept='image/*' className="rn2mconaddimg" onChange={handleChangeImage} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />} {/* Display image preview */}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="rnmcontit">Images</div>
                  </td>
                  <td>
                    <div className="image-container">
                      {newRefund.imgUrls.map((imageUrl, index) => (
                        <div key={index} className="image-wrapper">
                          <img src={imageUrl} alt={`Image ${index}`} style={{ width: '100px', height: '100px' }} />
                          <button type="buttonr" onClick={() => handleRemoveImage(index)}>Remove</button>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="rbutton-container">
              <button className="editbtn" onClick={handleUpdate}>Save Details</button>
              <button className="dltbtn" onClick={() => handleDelete(newRefund?.orderId)}>Delete</button>
            </div>
            <div className='rsavebtncon'>
            {/* <button className="save-details-button" >Save Details</button> */}

            </div>
            </div>
          </form>
          
        
      </center>
      <ToastContainer />
    </div>
  );
};

export default RefundEdit;
