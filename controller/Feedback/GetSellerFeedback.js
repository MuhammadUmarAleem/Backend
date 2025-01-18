const Feedback = require('../../models/Feedback');
const Buyer = require('../../models/Buyer');
const Seller = require('../../models/Seller');
const User = require('../../models/User'); // Assuming the User model contains profile pictures

exports.GetSellerFeedback = async (req, res) => {
    const { sellerId } = req.params;
    const { timeFilter = '0' } = req.query; // Default to today's feedback if no timeFilter is provided

    try {
        // Step 1: Build query with sellerId
        const query = { sellerId };
        const now = new Date();

        // Step 2: Determine date range based on timeFilter
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
        const feedbacks = await Feedback.find(query).populate('productId', 'productName description price');

        // Step 4: Retrieve buyer, seller, and their profile pictures
        const formattedFeedbacks = await Promise.all(
            feedbacks.map(async feedback => {
                const buyer = await Buyer.findOne({ userId: feedback.buyerId }, 'firstName lastName email');
                const seller = await Seller.findOne({ userId: feedback.sellerId }, 'firstName lastName email businessName');

                // Fetch profile pictures from User table
                const buyerUser = await User.findOne({ _id: feedback.buyerId }, 'profile_Picture');
                const sellerUser = await User.findOne({ _id: feedback.sellerId }, 'profile_Picture');

                return {
                    ...feedback._doc, // Spread the original feedback document
                    buyerName: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : 'N/A',
                    sellerName: seller ? `${seller.firstName || ''} ${seller.lastName || ''}`.trim() : 'N/A',
                    businessName: seller?.businessName || 'N/A',
                    buyerProfilePicture: buyerUser?.profile_Picture || 'default_buyer_image.png', // Fallback to default
                    sellerProfilePicture: sellerUser?.profile_Picture || 'default_seller_image.png'  // Fallback to default
                };
            })
        );

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
