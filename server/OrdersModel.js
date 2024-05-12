const mongoose = require('mongoose');
const { status, type } = require('server/reply');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true // Ensure orderId is unique
    },
    orderDate: {
        type: Date,
        default: Date.now // Automatically set orderDate to current date and time when an order is created
    },
    UserId:Number,
    ContactStatus: {
        type:String,
        default : "Not contacted",
    },
    country: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'] // Regular expression to validate the email format
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    address02: String,
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    additionalDetails: String,
    shippingMethod: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    couponCode: String,
    productName: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'] // Ensuring quantity cannot be less than 1
    },
    size: {
        type: String,
        default: 'Free Size' // Default value if none provided
    },
    color: {
        type: String,
        default: 'Signature Color' // Default value if none provided
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a non-negative number'] // Ensuring price cannot be negative
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'Total must be a non-negative number'] // Ensuring total cannot be negative
    },
    imageUrl: String,
    Status: {
        type: String,
        default: 'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
