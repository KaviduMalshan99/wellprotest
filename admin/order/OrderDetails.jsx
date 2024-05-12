import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useParams } from 'react-router-dom';
import './orderdetails.scss'; // Import the CSS file

const OrderDetails = () => {
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const { orderId } = useParams();

    useEffect(() => {
        console.log("Order ID:", orderId);
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/getOrder/${orderId}`);
                setOrderDetails(response.data.order);
                setLoading(false);
                console.log("Order Details:", response.data.order); // Log order details to console
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <div>
            <h2>Order Details</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="form-container"> {/* Apply the CSS styles */}
                    <form>
                        <label>Order ID:</label>
                        <input type="text" name="orderId" value={orderDetails.orderId} readOnly />

                        <label>Order Date:</label>
                        <input type="text" name="orderDate" value={orderDetails.orderDate} readOnly />

                        <label>Country:</label>
                        <input type="text" name="country" value={orderDetails.country} readOnly />

                        <label>Email:</label>
                        <input type="text" name="email" value={orderDetails.email} readOnly />

                        <label>First Name:</label>
                        <input type="text" name="firstName" value={orderDetails.firstName} readOnly />

                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={orderDetails.lastName} readOnly />

                        <label>Contact Number:</label>
                        <input type="text" name="contactNumber" value={orderDetails.contactNumber} readOnly />

                        <label>Address:</label>
                        <input type="text" name="address" value={orderDetails.address} readOnly />

                        <label>Address-line 02:</label>
                        <input type="text" name="address02" value={orderDetails.address02} readOnly />

                        <label>City:</label>
                        <input type="text" name="city" value={orderDetails.city} readOnly />

                        <label>State:</label>
                        <input type="text" name="State" value={orderDetails.State} readOnly />

                        <label>Postal Code:</label>
                        <input type="text" name="postalCode" value={orderDetails.postalCode} readOnly />

                        <label>Additional Details:</label>
                        <textarea name="additionalDetails" value={orderDetails.additionalDetails} readOnly />

                        <label>Shipping Method:</label>
                        <input type="text" name="shippingMethod" value={orderDetails.shippingMethod} readOnly />

                        <label>Payment Method:</label>
                        <input type="text" name="paymentMethod" value={orderDetails.paymentMethod} readOnly />

                        <label>Coupon Code:</label>
                        <input type="text" name="couponCode" value={orderDetails.couponCode} readOnly />

                        {/* Display additional details */}
                        <label>Product Image</label>
                        {orderDetails.image ? (
                            <img src={orderDetails.image} alt="Product" style={{ maxWidth: '200px' }} />
                        ) : (
                            <p>No image available</p>
                        )}

                        <label>Product Name:</label>
                        <input type="text" name="productName" value={orderDetails.ProductName} readOnly />

                        <label>Product ID:</label>
                        <input type="text" name="productId" value={orderDetails.id} readOnly />

                        <label>Quantity:</label>
                        <input type="text" name="quantity" value={orderDetails.quantity} readOnly />

                        <label>Size:</label>
                        <input type="text" name="size" value={orderDetails.size} readOnly />

                        <label>Color:</label>
                        <input type="text" name="color" value={orderDetails.color} readOnly />

                        <label>Price:</label>
                        <input type="text" name="price" value={orderDetails.price} readOnly />

                        <label>Total Price:</label>
                        <input type="text" name="totalPrice" value={orderDetails.total} readOnly />
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
