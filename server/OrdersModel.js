const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrdersSchema = new Schema({
    OderId:Number,
    UserId:Number,
    catagory:[String],
    ProductsIds:[Number],
    ProductNames:[String],
    Count:Number,
    TotalPrice:Number,
});

const Order = mongoose.model('Order',OrdersSchema);
module.exports = Order;