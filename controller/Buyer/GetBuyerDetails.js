const Order = require('../../models/Order'); // Adjust the path based on your project structure

// Function to check the last order details for a given buyerId
exports.GetBuyerDetails = async (req, res) => {
    const { buyerId } = req.params; // Assuming the buyerId is passed as a URL parameter

    try {
        // Find the last order for the given buyerId, sorted by creation date
        const lastOrder = await Order.findOne({ buyerId })
            .sort({ createdAt: -1 }) // Sort in descending order of creation date
            .select('buyerDetail createdAt updatedAt'); // Select only relevant fields

        if (lastOrder) {
            // If a last order exists, return its details
            return res.status(200).json({
                message: 'Buyer detail found',
                buyerDetail: lastOrder.buyerDetail,
            });
        } else {
            // If no orders exist for the buyer
            return res.status(404).json({
                message: 'Buyer detail not found',
            });
        }
    } catch (error) {
        console.error('Error retrieving last order details:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};
