
const Message = require('./DelayOrderChatModel');




const getMessagesByOrderId = async (req, res) => {
  const { orderId } = req.params;
  try {
    const messages = await Message.find({ orderId });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderIds = async (req, res) => {
  try {
    const orders = await Message.distinct(orderId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllCustomerMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createCustomerMessage = async (req, res) => {
  const { sender, message, orderId } = req.body;
  const newMessage = new Message({ sender, message, orderId });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const updateCustomerMessage = async (req, res) => {
  const { id } = req.params;
  const { sender, message } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(id, { sender, message }, { new: true });
    res.json(updatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCustomerMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await Message.findByIdAndDelete(id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





module.exports = { getAllCustomerMessages, createCustomerMessage, updateCustomerMessage, deleteCustomerMessage,getMessagesByOrderId, getOrderIds };


