const Order = require('../../models/Order'); // Import your Order model

// Function to fetch complete details of an order for a specific buyer
const GetBuyerOrders = async (req, res) => {
    const { buyerId } = req.params; // Getting buyerId from URL params

    try {
        // Fetch orders for the specified buyerId with complete details
        const orders = await Order.find({ buyerId })
            .exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this buyer' });
        }

        // Return the complete order details in the response
        res.status(200).json({
            message: 'Orders fetched successfully',
            data: orders
        });
    } catch (error) {
        console.error('Error fetching buyer orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

module.exports = {
    GetBuyerOrders,
};
