const Feedback = require('../../models/Feedback');

exports.GetSellerFeedback = async (req, res) => {
    const { sellerId } = req.params;
    const { timeFilter = 0 } = req.query; // Default to today's feedback if no timeFilter is provided

    try {
        // Step 1: Build query with sellerId
        const query = { sellerId };

        // Step 2: Determine date range based on timeFilter
        const now = new Date();

        if (timeFilter === '1') {
            // No date filter
        } else if (timeFilter === '2') {
            // Current week filter
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            query.createdAt = { $gte: startOfWeek };
        } else if (timeFilter === '3') {
            // Current month filter
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            query.createdAt = { $gte: startOfMonth };
        } else {
            // Default: Today's filter
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        // Step 3: Fetch feedbacks matching the query
        const feedbacks = await Feedback.find(query)
            .populate('buyerId', 'email role profile_Picture') // Fetch specific buyer details
            .populate('sellerId', 'email role profile_Picture') // Fetch specific seller details
            .populate('productId', 'productName description price'); // Fetch product details

        // Step 4: Add username slicing from email for buyers and sellers
        const formattedFeedbacks = feedbacks.map(feedback => ({
            ...feedback._doc, // Spread the original feedback document
            buyerName: feedback.buyerId?.email?.split('@')[0], // Extract name from buyer's email
            sellerName: feedback.sellerId?.email?.split('@')[0] // Extract name from seller's email
        }));

        // Step 5: Respond with formatted feedbacks
        res.status(200).json({
            message: 'Feedback retrieved successfully!',
            feedbacks: formattedFeedbacks
        });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
