const Feedback = require('../../models/Feedback');

exports.GetProductFeedback = async (req, res) => {
    const { productId } = req.params;

    try {
        const feedbacks = await Feedback.find({ productId })
            .populate('buyerId', 'email role profile_Picture') // Fetch specific buyer details
            .populate('sellerId', 'email role profile_Picture') // Fetch specific seller details
            .populate('productId', 'productName description price'); // Fetch product details

        // Add username slicing from email for buyers and sellers
        const formattedFeedbacks = feedbacks.map(feedback => ({
            ...feedback._doc, // Spread the original feedback document
            buyerName: feedback.buyerId.email.split('@')[0], // Extract name from buyer's email
            sellerName: feedback.sellerId.email.split('@')[0] // Extract name from seller's email
        }));

        res.status(200).json({
            message: 'Feedback retrieved successfully!',
            feedbacks: formattedFeedbacks
        });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
