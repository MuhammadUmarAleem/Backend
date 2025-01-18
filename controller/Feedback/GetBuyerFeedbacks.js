const Feedback = require('../../models/Feedback'); // Import your Feedback model
const Product = require('../../models/Product'); // Import your Product model

// Function to fetch feedback for a specific buyer and their related product details
const GetBuyerFeedbacks = async (req, res) => {
    const { buyerId } = req.params; // Extract buyerId from request parameters

    try {
        // Fetch feedback for the specified buyerId and populate the product details
        const feedbacks = await Feedback.find({ buyerId })
            .populate('productId', 'productName description price brand category') // Populate product details
            .exec();

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedback found for this buyer' });
        }

        // Return the feedbacks along with product details
        res.status(200).json({
            message: 'Feedback fetched successfully',
            data: feedbacks
        });
    } catch (error) {
        console.error('Error fetching buyer feedback:', error);
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

module.exports = {
    GetBuyerFeedbacks,
};