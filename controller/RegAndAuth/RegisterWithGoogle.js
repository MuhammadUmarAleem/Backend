const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:4000/api/v1/registerWithGoogle/callback');

// Function to initiate Google Login
exports.GoogleLogin = (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
    });

    // Redirect the user to Google OAuth login page
    res.redirect(authUrl);
};

// Function to handle the callback from Google
exports.GoogleCallback = async (req, res) => {
    const code = req.query.code;

    try {
        // Get the tokens using the code
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // Fetch user information from Google
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if they don't exist
            user = new User({
                email,
                password: null, // No password needed for Google OAuth users
                profile_Picture: picture,
                role: 'Buyer',
                active: true,
            });
            await user.save();
        }

        // Redirect the user to the home page or a success page
        res.status(200).json({ message: 'User authenticated and registered successfully', user });
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
