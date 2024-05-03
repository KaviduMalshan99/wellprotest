// RefundController.js
const { response } = require('./app');
const Refund = require('./RefundModel');
const Order = require('./OrdersModel'); // Import the Order model

//const fs = require('fs');



const getRefunds = (req, res, next) => {
    Refund.find()
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ message: error});
        });
};

const getRefundById = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const refund = await Refund.findOne({ orderId: orderId });
        if (!refund) {
            return res.status(404).json({ error: 'Refund not found' });
        }

        res.json({ refund });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addRefund = async (req, res, next) => {
    const { orderId, customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

    try {
        // Check if the orderId exists in the orders table
        const orderExists = await Order.exists({ orderId: orderId });
        if (!orderExists) {
            return res.status(400).json({ error: 'Order ID does not exist' });
        }

        // If the orderId exists, proceed to add the refund
        const newRefund = new Refund({
            orderId: orderId,
            customerName: customerName,
            customerEmail: customerEmail,
            reason: reason,
            refundDate: refundDate,
            imgUrls: imgUrls
        });

        const savedRefund = await newRefund.save();
        res.json({ response: savedRefund });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateRefund = (req, res, next) => {
    const orderId = req.params.orderId; // Extract orderId from path parameter
    const { customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

    Refund.findOneAndUpdate({ orderId: orderId }, { customerName, customerEmail, reason, refundDate, imgUrls }, { new: true })
        .then(response => {
            if (!response) {
                return res.status(404).json({ error: 'Refund not found' });
            }
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};


// const updateRefund = (req, res, next) => {
//     const orderId = req.params.orderId;
//     const { customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

//     Refund.findOneAndUpdate({ orderId: orderId }, { customerName, customerEmail, reason, refundDate, imgUrls }, { new: true })
//         .then(response => {
//             if (!response) {
//                 return res.status(404).json({ error: 'Refund not found' });
//             }
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ error });
//         });
// };

// const updateRefund = (req, res, next) => {
//     const orderId = req.params.orderId;
//     const { customerName, customerEmail, reason, refundDate, imgUrls } = req.body;

//     // Update the refund details
//     Refund.findOneAndUpdate(
//         { orderId: orderId },
//         { $set: { customerName: customerName }},
//         { $set: { customerEmail: customerEmail }},
//         { $set: { reason: reason }},
//         { $set: { refundDate: refundDate }},
//         { $set: { imgUrls: imgUrls }},
//         { new: true } // Return the updated document


//     )

//         .then(response => {
//             res.json({ response });
//         })
//         .catch(error => {
//             res.json({ error });
//         })
// };



const deleteRefund = ( req, res, next) => {
    const orderId = req.params.id;

    Refund.deleteOne({orderId: orderId })
        .then(response => {
            res.json({ response });
        })
        .catch(error => {
            res.json({ error });
        });
};

module.exports = { getRefunds, getRefundById, addRefund, deleteRefund, updateRefund };
