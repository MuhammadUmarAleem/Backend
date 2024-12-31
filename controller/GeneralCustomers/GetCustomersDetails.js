const User = require('../../models/User'); // Assuming this is the User model
const Review = require('../../models/Feedback'); // Assuming this is the Review model

exports.GetCustomersDetails = async (req, res) => {
    try {
        const { userId, sellerId } = req.params; // User ID and Seller ID passed as URL parameters

        // Step 1: Fetch user details
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 2: Fetch reviews for the specific seller from the user (reviewerId)
        const reviews = await Review.find({
            buyerId: userId,
            sellerId: sellerId,
        }).select('rating comment createdAt');

        // Step 3: Return user details along with reviews/ratings
        res.status(200).json({
            message: 'User details retrieved successfully.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profile_Picture: user.profile_Picture,
                role: user.role,
                active: user.active,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            reviews: reviews, // Include reviews for the specific seller
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'An error occurred while fetching user details.' });
    }
};
