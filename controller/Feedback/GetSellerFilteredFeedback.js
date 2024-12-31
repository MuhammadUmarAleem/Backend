const Feedback = require('../../models/Feedback');

exports.GetSellerFilteredFeedback = async (req, res) => {
    const { sellerId } = req.params;
    const { sortBy, startDate, endDate } = req.query; // Get query parameters

    try {
        // Build the query object
        const query = { sellerId };

        // Add date range filtering if startDate and endDate are provided
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Determine the sorting order
        let sortOrder;
        if (sortBy === 'Latest') {
            sortOrder = { createdAt: -1 }; // Sort by latest
        } else if (sortBy === ')ldest') {
            sortOrder = { createdAt: 1 }; // Sort by oldest
        } else if (sortBy === 'Highest') {
            sortOrder = { rating: -1 }; // Sort by highest rating
        }

        // Fetch feedback with filters and sorting
        const feedbacks = await Feedback.find(query)
            .populate('buyerId', 'email role profile_Picture') // Fetch specific buyer details
            .populate('sellerId', 'email role profile_Picture') // Fetch specific seller details
            .populate('productId', 'productName description price') // Fetch product details
            .sort(sortOrder);

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
