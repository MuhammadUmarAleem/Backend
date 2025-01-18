const Buyer = require('../../models/Buyer');
const User = require('../../models/User');

exports.GetBuyer = async (req, res) => {
    const { userId } = req.params; // Get userId from the request parameters

    try {
        // Step 1: Find the buyer details by userId
        const buyer = await Buyer.findOne({ userId }).populate('userId', 'email username profile_Picture role');

        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Step 2: Fetch user details associated with the buyer
        const user = buyer.userId;

        // Step 3: Format the response
        const buyerAndUserDetails = {
            firstName: buyer.firstName || 'N/A',
            lastName: buyer.lastName || 'N/A',
            phoneNumber: buyer.phoneNumber || 'N/A',
            address: buyer.address || 'N/A',
            jobTitle: buyer.jobTitle || 'N/A',
            primaryOrganization: buyer.primaryOrganization || 'N/A',
            administrator: buyer.administrator || false,
            createdAt: buyer.createdAt,
            updatedAt: buyer.updatedAt,
            userDetails: {
                email: user.email || 'N/A',
                username: user.username || 'N/A',
                profilePicture: user.profile_Picture || 'N/A',
                role: user.role || 'N/A',
            },
        };

        // Step 4: Send the response with buyer and user details
        res.status(200).json({
            message: 'Buyer and User details retrieved successfully!',
            buyerAndUserDetails
        });
    } catch (error) {
        console.error('Error retrieving buyer and user details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
