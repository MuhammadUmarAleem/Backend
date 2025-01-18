const User = require('../../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Function to hash the password using SHA-256
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Login route handler
exports.Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is active
        if (!user.active) {
            return res.status(403).json({ message: 'User account is inactive. Please contact support.' });
        }

        // Hash the provided password using SHA-256
        const hashedPassword = hashPassword(password);

        // Compare the hashed passwords
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, // Ensure JWT_SECRET is stored in your .env file
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Exclude the password from the user object before sending the response
        const userDetails = {
            _id: user._id,
            email: user.email,
            name: user.username,
            profile_Picture: user.profile_Picture,
            role: user.role,
            active: user.active,
            subscriptionId:user.subscriptionId
        };

        // Return the token and user details
        res.status(200).json({
            message: 'Login successful',
            token,
            user: userDetails
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
