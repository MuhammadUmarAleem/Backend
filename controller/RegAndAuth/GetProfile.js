const User = require('../../models/User'); // Assuming User model is already created

// Function to get user profile
exports.GetProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send full user object, including the password
        res.status(200).json({
            message: 'User profile fetched successfully',
            user, // The full user document
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
