const User = require('../../models/User'); // User model
const Review = require('../../models/Feedback'); // Review model
const Buyer = require('../../models/Buyer'); // Buyer model

exports.GetCustomersDetails = async (req, res) => {
    try {
        const { userId, sellerId } = req.params; // User ID and Seller ID from URL parameters

        // Step 1: Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 2: Fetch buyer details
        const buyer = await Buyer.findOne({ userId });
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer details not found.' });
        }

        // Step 3: Fetch reviews for the specific seller from the user
        const reviews = await Review.find({
            buyerId: userId,
            sellerId: sellerId,
        }).select('rating comment createdAt');

        // Step 4: Return user details along with buyer details and reviews
        res.status(200).json({
            message: 'User details retrieved successfully.',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profile_Picture: user.profile_Picture,
                role: user.role,
                active: user.active,
                firstName: buyer.firstName,
                lastName: buyer.lastName,
                phoneNumber: buyer.phoneNumber,
                address: buyer.address,
                jobTitle: buyer.jobTitle,
                primaryOrganization: buyer.primaryOrganization,
                administrator: buyer.administrator,
                createdAt: buyer.createdAt,
                updatedAt: buyer.updatedAt,
            },
            reviews, // Include reviews for the specific seller
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'An error occurred while fetching user details.' });
    }
};
