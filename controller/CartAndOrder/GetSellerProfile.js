const Seller = require('../../models/Seller'); // Adjust the path to your Seller model
const Feedback = require('../../models/Feedback'); // Adjust the path to your Feedback model
const mongoose = require('mongoose');

// Get Seller Profile Controller
const GetSellerProfile = async (req, res) => {
    try {
        const userId = req.params.id; // Assume the User ID is passed as a route parameter

        // Find the seller profile by userId and populate the related User data
        const sellerProfile = await Seller.findOne({ userId })
            .populate('userId', 'email username profile_Picture role active') // Select specific fields from User
            .exec();

        if (!sellerProfile) {
            return res.status(404).json({ message: 'Seller profile not found' });
        }

        // Use aggregation to calculate average rating and review count
        const feedbackSummary = await Feedback.aggregate([
            { $match: { sellerId: new mongoose.Types.ObjectId(userId) } }, // Use 'new' with ObjectId
            {
                $group: {
                    _id: '$sellerId',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);

        // Prepare the response data
        const summaryData = feedbackSummary[0] || { averageRating: 0, reviewCount: 0 };

        res.status(200).json({
            success: true,
            data: {
                sellerProfile,
                reviews: {
                    averageRating: summaryData.averageRating.toFixed(2), // Limit to 2 decimal places
                    reviewCount: summaryData.reviewCount
                }
            }
        });
    } catch (error) {
        console.error('Error fetching seller profile:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = { GetSellerProfile };
