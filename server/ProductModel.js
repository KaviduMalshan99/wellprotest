const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    ProductId: String,
    ProductName: String,
    Categories: [{ type: String }],
    Price: Number,
    Areas:[],
    Sizes: [{
        size:String,
        count:Number,
    }],
    Colors: [{
        name: String,
        count:Number,
        images: [String] // Array of image URLs for this color
    }],
    ImgUrls: [String], 
    Description:String,
    QuickDeliveryAvailable: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;