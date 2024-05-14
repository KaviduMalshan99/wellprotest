import React, { useState, useEffect } from 'react';
import './OrderCancellation.css';
import axios from 'axios';
import { toast } from 'react-toastify';


function AddOrderCancellation({ onClose, orderId }) {
  const [titleForCancellation, setTitleForCancellation] = useState("");
  const [reasonForCancellation, setReasonForCancellation] = useState("");
  const [orderIdExists, setOrderIdExists] = useState(true);

  useEffect(() => {
    const checkOrderId = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/getOrderCancellation`);
        const orderCancellationData = response.data;
        // Check if orderId exists in the order cancellation data
        setOrderIdExists(orderCancellationData.some(data => data.OrderID === orderId));
      } catch (error) {
        console.error("Error checking orderId for cancellation:", error);
        setOrderIdExists(false); // Assume Order ID does not exist on error
      }
    };

    checkOrderId();
  }, [orderId]);

  const handleCancelOrder = async (event) => {
    event.preventDefault();

    // Get the current date and format it as a string
  const currentDate = new Date().toISOString();

    const cancellationData = {
      OrderID: orderId,
      titleForCancellation: titleForCancellation,
      reasonForCancellation: reasonForCancellation,
      cancellationDate: currentDate
    };

    try {
      // Submit cancellation request to the backend
      const response = await axios.post(`http://localhost:3001/api/addOrderCancellation`, cancellationData);
      console.log("Cancellation submitted:", response.data);

        // Delete the order from the database
        await axios.delete(`http://localhost:3001/api/deleteOrder/${orderId}`);
        console.log('Order deleted successfully');
      toast.success('Order cancellation successful!', { autoClose: 3000 });
      // Close the popup after successful cancellation
      onClose();
    } catch (error) {
      console.error("Error submitting cancellation:", error);
      // Handle error state if needed
      toast.error('Failed to cancel order', { autoClose: 3000 });
    }
  };

  return (
    <div className="popup">
      <div id="popup-content">
        {orderIdExists ? (
          <p>This order ID is not eligible for cancellation.</p>
        ) : (
          <form onSubmit={handleCancelOrder}>
            <h1>Order Cancellation</h1>
            <p>Order ID: {orderId}</p>
            <label htmlFor="titleForCancellation">Title for cancellation:</label>
            <input
              type="text"
              id="titleForCancellation"
              value={titleForCancellation}
              onChange={(e) => setTitleForCancellation(e.target.value)}
              required
            />
            <label htmlFor="reasonForCancellation">Reason for cancellation:</label>
            <br></br>
            <textarea
              id="reasonForCancellation"
              value={reasonForCancellation}
              onChange={(e) => setReasonForCancellation(e.target.value)}
              minLength={10}
              maxLength={200}
              rows={6} // Adjust the number of visible rows (height)
               cols={50} // Adjust the number of visible columns (width)
              required
            ></textarea>
            <div>
             <button type="submit" className="submitButton">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddOrderCancellation;
