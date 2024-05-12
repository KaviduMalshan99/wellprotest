import React from 'react';
import './Letterhead.scss';

const Letterhead = ({ order }) => {
    return (
        <div className="letterheadd">
            <div className="header11">
                <img src="src/assets/logo.png" alt="WELL WORN Logo" className="logo"/>
                <div className="header-text">
                    <h1>WELL WORN (PRIVATE) LIMITED</h1>
                    <p>83C Horana Road, Weedagama, Bandaragama</p>
                    <p>+94 75 272 6993 | wellworn.fashion.lk@gmail.com</p>
                    <p>www.wellworn.lk</p>
                </div>
            </div>
            <div className="content" id="order-summary">
                <h2>Order Summary</h2>
                <div className="product-image11">
                    <img src={order.image} alt={order.ProductName}/>
                </div>
                <p>Name: {order.firstName} {order.lastName}</p>
                <p>Address: {order.address}</p>
                <p>City: {order.city}</p>
                <p>Shipping Method: {order.shippingMethod}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>Product Name: {order.ProductName}</p>
                <p>Product ID: {order.id}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Size: {order.size}</p>
                <p>Color: {order.color}</p>
                <p>Total: ${order.total}</p>
            </div>
            <div className="footer11">
                <p>Thank you for your business!</p>
            </div>
        </div>
    );
};

export default Letterhead;
