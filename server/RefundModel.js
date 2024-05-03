// RefundModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refundSchema = new Schema({
    orderId: String,
    customerName: String,
    customerEmail: String,
    reason: String,
    refundDate: {
        type: Date,
        default: Date.now
    },
    imgUrls:[String]
    // image: {
    //     data: Buffer,
    //     contentType: String
    // }
    // Add more fields as needed, e.g., itemImage
});

const Refund = mongoose.model('refund', refundSchema);

module.exports = Refund;
