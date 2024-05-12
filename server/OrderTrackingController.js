const Order = require('./OrdersModel');
const OrderTracking = require('./OrderTrackingModule');



const addTrackingEntry = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    let trackingEntry = await OrderTracking.findOne({ orderId });
    if (!trackingEntry) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      const { orderDate, country } = order;
      const firstStateDate = new Date();
      trackingEntry = new OrderTracking({
        orderId,
        orderDate,
        estimatedDate: new Date(orderDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        country,
        firstStateDate,
        secondStateDate: new Date(firstStateDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        thirdStateDate: new Date(firstStateDate.getTime() + 10 * 24 * 60 * 60 * 1000),
        fourthStateDate: null,
        fifthStateDate: null,
        sixthStateDate: null
      });
      await trackingEntry.save();
    }
    res.json({ trackingEntry });
  } catch (error) {
    console.error('Error creating tracking entry:', error);
    res.status(500).json({ error: 'Error creating tracking entry' });
  }
};

const updateTrackingStatus = async (req, res) => {
  const { orderId } = req.params; // Extract orderId from URL
  const { status } = req.body;

  try {
    const currentDate = new Date();
    let trackingEntry = await OrderTracking.findOne({ orderId });

    if (!trackingEntry) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    // Update the appropriate date field based on status
    switch (status) {
      case 'Arrival in Custom':
        trackingEntry.fourthStateDate = currentDate;
        break;
        case 'Courier Selected':
            trackingEntry.fifthStateDate = currentDate;
            break;
        case 'Delivered':
            trackingEntry.sixthStateDate = currentDate;
            break;
        default:
             break;

      
    }

    await trackingEntry.save();
    res.json({ message: 'Tracking status updated successfully' });
  } catch (error) {
    console.error('Error updating tracking status:', error);
    res.status(500).json({ error: 'Error updating tracking status' });
  }
};

// Function to get tracking details for a specific order ID
const getTrackingDetails = async (req, res) => {
  try {
    const trackingEntries = await OrderTracking.find();

    if (!trackingEntries || trackingEntries.length === 0) {
      return res.status(404).json({ error: 'No tracking entries found' });
    }

    res.json({ trackingEntries });
  } catch (error) {
    console.error('Error fetching tracking details:', error);
    res.status(500).json({ error: 'Error fetching tracking details' });
  }
};


// Function to get tracking details for a specific order ID
const getTrackingByOrderId = async (req, res) => {
  const { orderId } = req.params;

  try {
    const trackingEntry = await OrderTracking.findOne({ orderId });

    if (!trackingEntry) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.status(200).json({ trackingEntry });
  } catch (error) {
    console.error('Error fetching tracking information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to delete tracking details for a specific order ID
const deleteTrackingDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedEntry = await OrderTracking.deleteOne({ orderId });

    if (deletedEntry.deletedCount === 0) {
      return res.status(404).json({ error: 'Tracking entry not found' });
    }

    res.json({ message: 'Tracking entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting tracking entry:', error);
    res.status(500).json({ error: 'Error deleting tracking entry' });
  }
};

module.exports = { addTrackingEntry, updateTrackingStatus,getTrackingDetails, deleteTrackingDetails, getTrackingByOrderId };
