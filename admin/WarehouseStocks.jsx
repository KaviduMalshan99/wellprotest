import React, { useState, useEffect } from 'react';
import './WarehouseOrders.css';
import { Link } from "react-router-dom";
import axios from 'axios';

function WarehouseStocks() {
  const [stocks, setStocks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editStock, setEditStock] = useState({ productId: '', productName: '', sizes: [], colors: [], warehouseId: '', stockquantity: '' });
  const maxQuantity = 60;

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/stocks');
      if (response.data && Array.isArray(response.data)) {
        setStocks(response.data);
      } else {
        console.error('Invalid data format received from stocks:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stocks', error);
    }
  };

  const handleEdit = (index, stock) => {
    setEditIndex(index);
    setEditStock({ ...stock });
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
    setEditStock({ productId: '', productName: '', sizes: [], colors: [], warehouseId: '', stockquantity: '' });
  };

  const handleUpdate = async () => {
    try {
      const { _id, ...updatedStock } = editStock;
      await axios.put(`http://localhost:3001/api/stocks/${_id}`, updatedStock);
      setEditIndex(-1);
      fetchStocks();
    } catch (error) {
      console.error('Failed to update stock', error);
    }
  };

  const handleDelete = async (stockId) => {
    try {
      await axios.delete(`http://localhost:3001/api/stocks/${stockId}`);
      fetchStocks();
    } catch (error) {
      console.error('Failed to delete stock', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditStock(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /*   const adjustStocks = async () => {
      try {
          const response = await axios.post('http://localhost:3001/api/adjustStockQuantities');
          if (response.data.success) {
              alert('Stock quantities have been updated.');
              fetchStocks(); // Refresh the stock data after adjustment
          } else {
              alert('Failed to update stock quantities.');
          }
      } catch (error) {
          console.error('Error adjusting stock quantities:', error);
          alert('Error adjusting stock quantities.');
      }
  }; */

  const adjustStockAndClearDispatchedOrders = async () => {
    try {
      // Assume this function adjusts stock quantities based on dispatched orders
      const adjustmentResponse = await axios.post('http://localhost:3001/api/adjustStockQuantities');
      console.log('Stock adjustment response:', adjustmentResponse.data);

      if (adjustmentResponse.data.success) {
        // Now delete all records from the DispatchedOrders table
        const deleteResponse = await axios.delete('http://localhost:3001/api/dispatchedOrders');
        console.log('Delete dispatched orders response:', deleteResponse.data);
        fetchStocks();

        if (!deleteResponse.data.success) {
          console.error('Failed to delete dispatched orders:', deleteResponse.data.message);
        }
      } else {
        console.error('Failed to adjust stock:', adjustmentResponse.data.message);
      }
    } catch (error) {
      console.error('Error in adjusting stock or deleting dispatched orders:', error);
    }
  };


  return (
    <div>
      <div className="wareordtit">Current Stocks <Link to="/admin/warehouse" className="whinbkbtn">Warehouses</Link><Link to="/admin/orderstable" className="whinbkbtn">Orders</Link><Link to="/admin/warehouseorders" className="whinbkbtn">New Stock</Link></div>
      <button onClick={adjustStockAndClearDispatchedOrders} className="whinbkbtn">Adjust Stock Quantities</button>
      <div className="wareortable">
        <table className='Waresuportab'>
          <thead>
            <tr>
              <th>ProductID</th>
              <th>Product Name</th>
              <th>ProductSize</th>
              <th>ProductColor</th>
              <th>Warehouse</th>
              <th>Quantity</th>
              <th className="Titlehead">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock._id}>
                <td>{editIndex === index ? <input name="productId" value={editStock.productId} onChange={handleInputChange} /> : stock.productId}</td>
                <td>{editIndex === index ? <input name="productName" value={editStock.productName} onChange={handleInputChange} /> : stock.productName}</td>
                <td>{editIndex === index ? <input name="sizes" value={editStock.sizes} onChange={handleInputChange} /> : stock.sizes.join(', ')}</td>
                <td>{editIndex === index ? <input name="colors" value={editStock.colors} onChange={handleInputChange} /> : stock.colors.join(', ')}</td>
                <td>{editIndex === index ? <input name="warehouseId" value={editStock.warehouseId} onChange={handleInputChange} /> : stock.warehouseId}</td>
                <td>{editIndex === index ? <input name="stockquantity" value={editStock.stockquantity} onChange={handleInputChange} /> : stock.stockquantity}</td>
                <td className="data">
                  {editIndex === index ? (
                    <div className="supbtnmcon">
                      <button className="view-more-update" onClick={handleUpdate}>Save</button>
                      <button className="view-more-cancel" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  ) : (
                    <div className="supbtnmcon">
                      <button className="view-more-update" onClick={() => handleEdit(index, stock)}>Update</button>
                      <button className="view-more-delete" onClick={() => handleDelete(stock._id)}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarehouseStocks;
