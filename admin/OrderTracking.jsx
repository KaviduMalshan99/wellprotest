import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersTracking.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extract and return YYYY-MM-DD part
};
const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [trackingEntries, setTrackingEntries] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders');
      console.log(response.data); // Check the structure of response data
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  const fetchTrackingEntries = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tracking');
      setTrackingEntries(response.data.trackingEntries);
    } catch (error) {
      console.error('Error fetching tracking entries:', error);
    }
  };
  

  useEffect(() => {
    fetchOrders();
    fetchTrackingEntries();
  }, []);


  const handleCheckboxChange = (orderId) => {
    setSelectedOrderIds((prevSelectedOrderIds) => {
      const newSelectedOrderIds = new Set(prevSelectedOrderIds);
      if (newSelectedOrderIds.has(orderId)) {
        newSelectedOrderIds.delete(orderId);
      } else {
        newSelectedOrderIds.add(orderId);
      }
      return newSelectedOrderIds;
    });
  };

  const handleStatusUpdate = async (status) => {
    if (selectedOrderIds.size === 0) {
      console.warn('Please select at least one order.');
      return;
    }

    try {
      if (status === 'Dispatch from CN Warehouse') {
        // Create new tracking entries for selected orders with 'Dispatch from CN Warehouse' status
        for (const orderId of selectedOrderIds) {
          await axios.post('http://localhost:3001/api/tracking', { orderId, status });
        }
      } else {
        // Update status for selected orders with other statuses using axios.put
        const orderIds = Array.from(selectedOrderIds); // Convert Set to Array
        await Promise.all(orderIds.map(async (orderId) => {
          await axios.put(`http://localhost:3001/api/tracking/${orderId}`, { status });
        }));
      }

      // After updating, fetch updated tracking entries
      fetchTrackingEntries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteTrackingEntry = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3001/api/tracking/${orderId}`);
      setTrackingEntries((prevEntries) => prevEntries.filter((entry) => entry.orderId !== orderId));
    } catch (error) {
      console.error('Error deleting tracking entry:', error);
    }
  };

  return (
    <div>
    <div className="orders-container">

      <div className="left-panel">
      <h2>Orders</h2>
     
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Order ID</th>
          </tr>
        </thead>
        
        <tbody >

          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrderIds.has(order.orderId)}
                  onChange={() => handleCheckboxChange(order.orderId)}
                />
              </td>
              <td>{order.orderId}</td>
            </tr>
          ))}
        </tbody>
       
      </table>
      </div>

      
      
      <div className="right-panel">
      <h2>Tracking Table</h2>
      <table>
        <thead>
          <tr >
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Estimated Date</th>
            <th>Country</th>
            <th>Dispatch from CN Warehouse</th>
            <th>CN Custom</th>
            <th>Air Fred Company</th>
            <th>Arrival in Custom</th>
            <th>Courier Selected</th>
            <th>Delivered</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody >
          {trackingEntries.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.orderId}</td>
              <td>{formatDate(entry.orderDate)}</td>
              <td>{formatDate(entry.estimatedDate)}</td>
              <td>{entry.country}</td>
              <td>{formatDate(entry.firstStateDate)}</td>
              <td>{formatDate(entry.secondStateDate)}</td>
              <td>{formatDate(entry.thirdStateDate)}</td>
              <td>{entry.fourthStateDate ? formatDate(entry.fourthStateDate) :'-'}</td>
              <td>{entry.fifthStateDate ? formatDate(entry.fifthStateDate) : '-'}</td>
              <td>{entry.sixthStateDate ? formatDate(entry.sixthStateDate) : '-'}</td>
              <td><button onClick={() => deleteTrackingEntry(entry.orderId)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>


      <div className='OderTracking_Status_Update'>
      
      <h2>Status Update</h2>
      <div>
        {/* Render radio buttons for different statuses */}
        <label>
          <input
            type="radio"
            name="status"
            value="Dispatch from CN Warehouse"
            onChange={() => handleStatusUpdate('Dispatch from CN Warehouse')}
          />
          Dispatch from CN Warehouse
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="Arrival in Custom"
            onChange={() => handleStatusUpdate('Arrival in Custom')}
          />
          Arrival in Custom
        </label>


        <label>
          <input
            type="radio"
            name="status"
            value="Courier Selected"
            onChange={() => handleStatusUpdate('Courier Selected')}
          />
          Courier Selected
        </label>

        <label>
          <input
            type="radio"
            name="status"
            value="Delivered"
            onChange={() => handleStatusUpdate('Delivered')}
          />
          Delivered
        </label>
      </div>
      </div>
    
    </div>
  );
};

export default OrderTracking;