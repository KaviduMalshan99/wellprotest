const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    UserId:Number,
    FirstName:String,
    Lastname :String,
    Email:String,
    Contact:String,
    Password:String,
    Country:String,
    District:String,
    City:String,
    Address:String,
    postalCode:Number,
    ProfileUrl:String,
});

const Customer = mongoose.model('Customer',CustomerSchema);

module.exports = Customer;

