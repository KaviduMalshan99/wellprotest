import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CusOrder.scss';
import { useAuthStore } from "../../src/store/useAuthStore";

function CustomerOrders() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState({});
  
    const userId = user?.UserId;
    console.log("customerid: ", userId);
  
    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3001/api/orders/customer/${userId}`)
                .then(response => {
                    const groupedOrders = groupOrdersByMonth(response.data);
                    setOrders(groupedOrders);
                })
                .catch(error => console.log('Error fetching orders:', error));
        }
    }, [userId]);

    function groupOrdersByMonth(orders) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return orders.reduce((acc, order) => {
            const date = new Date(order.orderDate);
            const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(order);
            return acc;
        }, {});
    }

    if (!Object.keys(orders).length) {
        return <p>No orders found</p>;
    }

    return (
        <div className="orders-list">
            {Object.entries(orders).map(([monthYear, ordersInMonth]) => (
                <div key={monthYear}>
                    <h3>{monthYear}</h3>
                    {ordersInMonth.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-image">
                                <img src={order.image[0]} alt={order.ProductName} />
                            </div>
                            <div className
="order-details">
                                <h5>{order.ProductName}</h5>
                                <p>Quantity: {order.quantity}</p>
                                <p>Size: {order.size}</p>
                                <p>Color: {order.color}</p>
                            </div>
                            <div className="order-actions">
                                <button onClick={() => alert('Review feature coming soon!')}>Add Review</button>
                                <button onClick={() => alert('Tracking feature coming soon!')}>Track Order</button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default CustomerOrders;
