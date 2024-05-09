const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for individual cart items
const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }, // Linking to Product model
    name: String,
    price: Number,
    image: String,
    size: String,
    color: String,
    quantity: Number,
    availableCount: Number
}, { _id: false }); // No separate _id needed for embedded document

// Define the main AddToCart schema
const AddToCartSchema = new Schema({
    cartId: { type: Schema.Types.ObjectId, index: true, required: true, auto: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer' }, 
    items: [CartItemSchema], 
    quickDeliveryAvailable: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, // Track when cart was created
    updatedAt: { type: Date, default: Date.now } // Track last update to the cart
});

const AddToCart = mongoose.model('AddToCart', AddToCartSchema);

module.exports = AddToCart;
