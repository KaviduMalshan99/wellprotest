require("dotenv").config();
const express = require("express");
const router = express.Router();
const AddToCart = require("./AddtoCartModel"); 

// Add an item to the cart
const addToCart = async (req, res) => {
    const { customerId, item } = req.body;

    try {
        // Check if the user already has a cart
        let cart = await AddToCart.findOne({ customerId });
        
        if (cart) {
            // Add new item to the cart's items array
            const existingItemIndex = cart.items.findIndex(cartItem => cartItem.productId.equals(item.productId) && cartItem.size === item.size && cartItem.color === item.color);

            if (existingItemIndex > -1) {
                // Update existing item quantity
                cart.items[existingItemIndex].quantity += item.quantity;
            } else {
                // Push the new item
                cart.items.push(item);
            }
        } else {
            // No cart for the user, create new cart
            cart = new AddToCart({
                customerId,
                items: [item]
            });
        }

        cart = await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get the cart for a specific customer
const getCart = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const cart = await AddToCart.findOne({ customerId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an item in the cart
const updateCartItem = async (req, res) => {
    const { cartId, itemId, quantity } = req.body;

    try {
        const cart = await AddToCart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Find the item and update quantity
        const itemIndex = cart.items.findIndex(item => item._id.equals(itemId));
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove an item from the cart
const removeCartItem = async (req, res) => {
    const { cartId, itemId } = req.body;

    try {
        const cart = await AddToCart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => !item._id.equals(itemId));
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
};
