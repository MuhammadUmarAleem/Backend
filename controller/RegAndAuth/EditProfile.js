const User = require('../../models/User'); // Assuming User model is already created
const crypto = require('crypto-js');

// Function to edit user profile
exports.EditProfile = async (req, res) => {
    const { userId,email, password, profile_Picture, username } = req.body;


    console.log(userId,email, password, profile_Picture, username);

    try {
        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields only if they are provided in the request
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
        }

        if (password) {
            // Hash the new password
            const hashedPassword = crypto.SHA256(password).toString();
            user.password = hashedPassword;
        }

        if (profile_Picture) {
            user.profile_Picture = profile_Picture;
        }

        if (username) {
            user.username = username;
        }

        // Save the updated user to the database
        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                email: user.email,
                username: user.username,
                profile_Picture: user.profile_Picture,
            },
        });
    } catch (error) {
        console.error('Error editing profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
