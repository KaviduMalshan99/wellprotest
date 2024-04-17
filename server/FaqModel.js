const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqSchema = new Schema ({
    FaqID: String,
    CustomerName: String,
    CustomerEmail: String,
    Question: String,
})

const Faq = mongoose.model('faq',faqSchema);

module.exports = Faq;