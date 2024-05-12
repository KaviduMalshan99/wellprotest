const { response } = require('express');
const Order = require('./OrdersModel');
const { sendEmail } = require('../server/util/email_templates/orderStatusEmailTemplate'); // Make sure this path is correct based on your project structure
// const sendEmail = require("./util/sendEmail");
const orderStatusEmailTemplate = require("./util/email_templates/orderStatusEmailTemplate");




const { sendEmail } = require('../server/utilities/emailUtility'); // Make sure this path is correct based on your project structure

// Function to generate order ID with the format OIDXXXXX
function generateOrderId() {
    const prefix = 'OID';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return prefix + randomNum.toString();
}

const getOrders = (req, res, next) => {
    Order.find()
        .then(orders => res.json({ orders }))
        .catch(error => res.status(500).json({ error: error.message }));
};

const addOrder = (req, res, next) => {
    const {
        country,
        email,
        firstName,
        lastName,
        contactNumber,
        State,
        address,
        address02,
        city,
        postalCode,
        additionalDetails,
        shippingMethod,
        paymentMethod,
        couponCode,
        ProductName,
        id,

        quantity,
        size,
        color,
        price,
        total,
        image,

        Status,
        ContactStatus 
    } = req.body;

    const orderId = generateOrderId();
    // Get UTC date and add 5.5 hours for Sri Lanka Time
    const offset = 5.5; // Sri Lanka UTC +5:30
    const orderDate = new Date(new Date().getTime() + offset * 3600 * 1000);


    const order = new Order({
        orderId,
        orderDate,
        country,
        email,
        firstName,
        lastName,
        contactNumber,
        State,
        address,
        address02,
        city,
        postalCode,
        additionalDetails,
        shippingMethod,
        paymentMethod,
        couponCode,
        ProductName,
        id,

        quantity,
        size,
        color,
        price,
        total,
        image,

        Status,
        ContactStatus 
    });

   order.save()
    .then(order => {
        sendEmail(order.toObject())  // Convert Mongoose model instance to a JS object
            .then(() => res.status(201).json({ message: "Order placed and email sent!", order }))
            .catch(emailError => {
                console.error("Email send error:", emailError);
                res.status(201).json({ message: "Order placed but email could not be sent", order });
            });
    })
    .catch(error => res.status(500).json({ error: error.message }));

};

const updateOrder = (req, res, next) => {
    const orderId = req.params.orderId;
    const updates = req.body;

    Order.findByIdAndUpdate(orderId, updates, { new: true })
        .then(updatedOrder => res.json({ updatedOrder }))
        .catch(error => res.status(500).json({ error: error.message }));
};



// In your backend controller
const updateContactStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: { ContactStatus: "Informed" } },
      { new: true }
    );
    if (updatedOrder) {
      res.json({ success: true, message: "Contact status updated successfully", data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  // Update Order Controller
  const updateOrderStatus = async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const updateResult = await Order.findOneAndUpdate(
        { orderId },
        { $set: { Status: "Dispatched" } },
        { new: true }
      );
  
      if (updateResult) {
        res.json({ success: true, message: "Order status updated successfully", data: updateResult });
      } else {
        res.status(404).json({ success: false, message: "Order not found" });
      }
    } catch (error) {
      console.error("Order status update failed:", error.message);
      res.status(500).json({ error });
    }
  };
  
  

  // send email
const sendOrderStatusEmail = async (req, res, next) => {
    try {
      const { toName, orderId, productName, Status, email } = req.body;
  
      const emailTemplate = orderStatusEmailTemplate(
        toName,
        orderId,
        productName,
        Status
      );
      sendEmail(email, "Order Status Update", emailTemplate);
  
      // change the contact status to "Informed"
      await Order.findOneAndUpdate(
        { orderId: orderId },
        { $set: { ContactStatus: "Informed" } },
        { new: true }
      );
  
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      res.json({ error });
    }
  };




const deleteOrder = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.deleteOne({ orderId })
        .then(result => {
            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Order deleted successfully' });
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        })
        .catch(error => res.status(500).json({ error: 'Internal server error' }));
};


const getOrderById = async (req, res, next) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getOrders, addOrder, updateOrder, deleteOrder, getOrderById,updateContactStatus , sendOrderStatusEmail,updateOrderStatus };
