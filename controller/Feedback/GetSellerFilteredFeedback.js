const Feedback = require('../../models/Feedback');
const Buyer = require('../../models/Buyer');
const Seller = require('../../models/Seller');
const User = require('../../models/User'); // Assuming User model contains profile pictures

exports.GetSellerFilteredFeedback = async (req, res) => {
    const { sellerId } = req.params;
    const { sortBy, startDate, endDate } = req.query; // Get query parameters

    try {
        // Step 1: Build the query object
        const query = { sellerId };

        // Add date range filtering if startDate and endDate are provided
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Step 2: Determine the sorting order
        let sortOrder;
        if (sortBy === 'Latest') {
            sortOrder = { createdAt: -1 }; // Sort by latest
        } else if (sortBy === 'Oldest') {
            sortOrder = { createdAt: 1 }; // Sort by oldest
        } else if (sortBy === 'Highest') {
            sortOrder = { rating: -1 }; // Sort by highest rating
        }

        // Step 3: Fetch feedbacks matching the query and sorting
        const feedbacks = await Feedback.find(query)
            .populate('productId', 'productName description price'); // Fetch product details

        // Step 4: Retrieve buyer and seller details, including their profile pictures
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
            feedbacks: formattedFeedbacks.sort((a, b) => {
                if (sortBy === 'Latest' || sortBy === 'Oldest') {
                    return sortOrder.createdAt === -1 ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
                }
                if (sortBy === 'Highest') {
                    return b.rating - a.rating; // Sorting by rating
                }
                return 0;
            })
        });
    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
