import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ordertable.scss';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const OrderTable = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All');
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/orders');
            const ordersData = response.data.orders.map(order => ({
                ...order,
                orderDate: new Date(order.orderDate)
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const downloadExcel = () => {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0]; // This will format the date as "YYYY-MM-DD"
        const fileName = `OrderData_${formattedDate}.xlsx`; // Adds the date to the filename
    
        // Extracting only the desired fields from each order
        const ordersDataForExcel = orders.map(order => ({
            orderId: order.orderId,
            orderDate: order.orderDate.toLocaleDateString(), // Adjust date format as needed
            country: order.country,
            email: order.email,
            firstName: order.firstName,
            lastName: order.lastName,
            contactNumber: order.contactNumber,
            address: order.address,
            address02: order.address02,
            city: order.city,
            postalCode: order.postalCode,
            additionalDetails: order.additionalDetails,
            shippingMethod: order.shippingMethod,
            paymentMethod: order.paymentMethod,
            couponCode: order.couponCode,
            ProductName: order.ProductName,
            id: order.id,
            quantity: order.quantity,
            size: order.size,
            color: order.color,
            price: order.price,
            total: order.total
        }));
    
        // Convert data to worksheet
        const ws = XLSX.utils.json_to_sheet(ordersDataForExcel);
    
        // Create workbook and add the worksheet
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    
        // Convert workbook to Excel buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
        // Create Blob object from Excel buffer
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
        // Trigger download
        saveAs(data, fileName);
    };
    
    const addShippingMethod = () => {
        console.log("Add Shipping Method clicked");
        navigate('/admin/shipping')
    };

    const applyCoupon = () => {
        console.log("Coupon button clicked");
        navigate('/admin/coupon')

    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCountryChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const confirmDelete = (orderId) => {
        setCurrentOrderId(orderId);
        setShowConfirm(true);
    };

    const deleteOrder = () => {
        axios.delete(`http://localhost:3001/api/deleteOrder/${currentOrderId}`)
            .then(() => {
                setOrders(prev => prev.filter(o => o.orderId !== currentOrderId));
                setShowConfirm(false);
            })
            .catch(err => {
                console.error('Error deleting order:', err);
                setShowConfirm(false);
            });
    };

    const filteredOrders = orders.filter(order => {
        return (
            (order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === '') &&
            (order.country === selectedCountry || selectedCountry === 'All') &&
            (order.paymentMethod === selectedPaymentMethod || selectedPaymentMethod === 'All')
        );
    });

    return (
        <div className="order-table-container">
        <div className="header">
            <h2>Order Table</h2>
                <div>
                    <button className="export-btn" onClick={downloadExcel}>Export to Excel</button>
                    <div className="action-buttons">
                        <button className="method-btn" onClick={addShippingMethod}>Add Shipping Method</button>
                        <button className="coupon-btn" onClick={applyCoupon}>Coupon</button>
                    </div>
                </div>
            </div>
        <div className="controls-container">
            <div className="filter-container">
                <label className="filter-label">Country:</label>
                <select className="filter-dropdown" value={selectedCountry} onChange={handleCountryChange}>
                    <option value="All">All Countries</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="US">US</option>
                    <option value="India">India</option>
                </select>
                <label className="filter-label">Payment Method:</label>
                <select className="filter-dropdown" value={selectedPaymentMethod} onChange={handlePaymentMethodChange}>
                    <option value="All">All Methods</option>
                    <option value="koko">Koko</option>
                    <option value="webxpay">WebXpay</option>
                    <option value="cod">COD</option>
                </select>
                <input
                type="text"
                placeholder="Search by Order ID"
                className="search-bar"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            </div>
   
        </div>
        <table className="order-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Name</th>
                    <th>Country</th>
                    <th>Payment Method</th>
                    <th>Item No</th>
                    <th>Date</th>
                    <th>All Order Details</th>
                    <th>Remove Order</th>
                </tr>
            </thead>
            <tbody>
                {filteredOrders.map(order => (
                    <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.firstName} {order.lastName}</td>
                        <td>{order.country}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.id}</td>
                        <td>{order.orderDate.toLocaleDateString()}</td>
                        <td>
                            <button className="view-more-btn" onClick={() => navigate(`/admin/OrderDetails/${order.orderId}`)}>View More</button>
                        </td>
                        <td>
                            <button className="delete-btn" onClick={() => confirmDelete(order.orderId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {showConfirm && (
            <div className="confirm-dialog">
                <p>Are you sure you want to delete this order?</p>
                <div>
                    <button onClick={deleteOrder}>Yes</button>
                    <button onClick={() => setShowConfirm(false)}>No</button>
                </div>
            </div>
        )}
        </div>
    );
};

export default OrderTable;
