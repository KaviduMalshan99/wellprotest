import React, { useState, useEffect } from 'react';
import './OrderCancellationsList.css';
import axios from 'axios';

const OrderCancellationList = () => {
  const [orderCancellations, setOrderCancellations] = useState([]);

  useEffect(() => {
    fetchOrderCancellations();
  }, []);

  const fetchOrderCancellations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getOrderCancellation');
      setOrderCancellations(response.data.response);
    } catch (error) {
      console.error('Error fetching order cancellations:', error);
    }
  };

  const handleDeleteOrderCancellation = async (OrderID) => {
    try {
      await axios.delete(`http://localhost:3001/api/deleteOrderCancellation/${OrderID}`);
      console.log(`Order cancellation with ID ${OrderID} deleted successfully.`);
      // After deletion, fetch the updated list of order cancellations
      fetchOrderCancellations();
    } catch (error) {
      console.error('Error deleting order cancellation:', error);
    }
  };

  return (
    <div>
      <h1>Order Cancellation List</h1>
      <br /><br />
      <center>
        <div>
          <table className="table">
            <tbody>
              <tr className='tr'>
                <th>Order ID</th>
                <th>Title for Cancellation</th>
                <th>Reason for Cancellation</th>
                <th>Delete</th>
              </tr>
              {orderCancellations.map((orderCancellation, index) => (
                <tr key={index} className='tr'>
                  <td>{orderCancellation.OrderID}</td>
                  <td>{orderCancellation.titleForCancellation}</td>
                  <td>{orderCancellation.reasonForCancellation}</td>
                  <td>
                    <button className="deleteButton" onClick={() => handleDeleteOrderCancellation(orderCancellation.OrderID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
    </div>
  );
}

export default OrderCancellationList;
