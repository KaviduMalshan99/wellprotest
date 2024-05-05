const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    ReviewID: String,
    ReviewNum: Number,
    ProductID: String,
    Date: Date,
    CustomerID: String,
    CustomerName: String,
    CustomerEmail:String,
    Ratecount: Number,
    ReviewTitle: String,
    ReviewBody: String,
    ReviewImage: [],
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;