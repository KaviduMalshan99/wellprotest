import React, { useState, useEffect } from 'react';
import './WarehouseOrders.css';
import axios from 'axios';

function WarehouseOrders() {
    const [orders, setOrders] = useState([]);
    const [acceptedStocks, setAcceptedStocks] = useState([]);

    useEffect(() => {
        fetchStocks();
        fetchAcceptedStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/getstock');
            if (response.data && Array.isArray(response.data.response)) {
                setOrders(response.data.response);
            } else {
                console.error('Invalid data format received:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stocks', error);
        }
    };

    const fetchAcceptedStocks = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/acceptedstocks');
            if (response.data && Array.isArray(response.data.response)) {
                setAcceptedStocks(response.data.response);
            } else {
                console.error('Invalid data format for accepted stocks:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch accepted stocks', error);
        }
    };

    const handleAccept = async (index) => {
        const order = orders[index];
        try {
            // Send the request to accept and modify stock
            const response = await axios.post(`http://localhost:3001/api/acceptstock/${order.supstockId}`, {
                supstockId: order.supstockId,
                productId: order.supproductId,
                productName: order.supproductnamee,
                sizes: Array.isArray(order.sizes) ? order.sizes : [order.sizes],
                colors: Array.isArray(order.colors) ? order.colors : [order.colors],
                warehouseId: order.warehousenameid,
                stockquantity: order.stockquantity
            });
    
            if (response.status === 200) {
                // Remove from the orders array and add to the accepted stocks
                const newOrders = [...orders];
                newOrders.splice(index, 1);
                setOrders(newOrders);
    
                const newAcceptedStock = response.data;
                const updatedAcceptedStocks = [...acceptedStocks, newAcceptedStock];
                setAcceptedStocks(updatedAcceptedStocks);
            } else {
                console.error('Failed to update stock status', response);
            }
        } catch (error) {
            console.error('Error updating stock', error);
        }
    };
    

    const handleDecline = async (index) => {
        const order = orders[index];
        console.log(`Attempting to delete stock with supstockId: ${order.supstockId}`);
        try {
            // Make an API request to delete the stock by supstockId
            const response = await axios.delete(`http://localhost:3001/api/supplierstock/${order.supstockId}`);
            
            if (response.status === 200 || response.status === 204) {
                // Remove the declined order from the state
                const newOrders = [...orders];
                newOrders.splice(index, 1);
                setOrders(newOrders);
                console.log('Stock deleted successfully:', order.supstockId);
            } else {
                console.error('Unexpected response status when deleting stock:', response);
            }
        } catch (error) {
            console.error('Error deleting stock:', error.message || error);
        }
    };

    const handleDelete = async (index) => {
        const order = orders[index];
        console.log(`Attempting to delete stock with supstockId: ${order.supstockId}`);
        try {
            // Make an API request to delete the stock by supstockId
            const response = await axios.delete(`http://localhost:3001/api/supplierstock/${order.supstockId}`);
            
            if (response.status === 200 || response.status === 204) {
                // Remove the declined order from the state
                const newOrders = [...orders];
                newOrders.splice(index, 1);
                setOrders(newOrders);
                console.log('Stock deleted successfully:', order.supstockId);
            } else {
                console.error('Unexpected response status when deleting stock:', response);
            }
        } catch (error) {
            console.error('Error deleting stock:', error.message || error);
        }
    };

    return (
        <div>
            <div className="wareordtit">Warehouse Orders</div>
            <div className="wareortable">
                <table className='Waresuportab'>
                    <thead>
                        <tr>
                            <th>Stock ID</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Size</th>
                            <th>Product Color</th>
                            <th>Quantity</th>
                            <th>Warehouse</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.supstockId}>
                                <td>{order.supstockId}</td>
                                <td>{order.supproductId}</td>
                                <td>{order.supproductnamee}</td>
                                <td>{order.sizes.join(', ')}</td>
                                <td>{order.colors.join(', ')}</td>
                                <td>{order.stockquantity}</td>
                                <td>{order.warehousenameid}</td>
                                <td>
                                    <div className="wreortabacbtn">
                                        <button className='waresupactbtn' onClick={() => handleAccept(index)}>Accept</button>
                                        <button className='waresupactbtn' onClick={() => handleDecline(index)}>Decline</button>
                                        <button className='view-more-delete' onClick={() => handleDelete(index)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="wareordtit">Accepted Stocks</div>
            <div className="wareortable">
                <table className='Waresuportab'>
                    <thead>
                        <tr>
                            <th>Stock ID</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Size</th>
                            <th>Product Color</th>
                            <th>Quantity</th>
                            <th>Warehouse</th>
                            <th>Date Accepted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acceptedStocks.map(stock => (
                            <tr key={stock.supstockId}>
                                <td>{stock.supstockId}</td>
                                <td>{stock.supproductId}</td>
                                <td>{stock.supproductnamee}</td>
                                <td>{stock.sizes.join(', ')}</td>
                                <td>{stock.colors.join(', ')}</td>
                                <td>{stock.stockquantity}</td>
                                <td>{stock.warehousenameid}</td>
                                <td>{new Date(stock.acceptedDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WarehouseOrders;
