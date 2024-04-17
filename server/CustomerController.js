const express = require('express');
const router = express.Router();
const Customer = require('./CustomerModel');

const getCustomer = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        res.json({ customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCustomerById = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const customer = await Customer.findOne({ UserId: userId });
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.json({ customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addCustomer = async (req, res, next) => {
    const customerData = req.body;

    try {
        const customer = new Customer(customerData);
        const savedCustomer = await customer.save();
        res.json({ customer: savedCustomer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCustomer = async (req, res, next) => {
    const userId = req.params.userId;
    const customerData = req.body;

    try {
        const updatedCustomer = await Customer.findOneAndUpdate(
            { UserId: userId },
            { $set: customerData },
            { new: true }
        );
        res.json({ customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCustomer = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        await Customer.deleteOne({ UserId: userId });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCustomer,getCustomerById, addCustomer, updateCustomer, deleteCustomer };
