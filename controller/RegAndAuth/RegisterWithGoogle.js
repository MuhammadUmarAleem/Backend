const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/User');
const Buyer = require('../../models/Buyer');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:4000/api/v1/registerWithGoogle/callback');

// Function to initiate Google Login
exports.GoogleLogin = (req, res) => {
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
    });
    res.redirect(authUrl);
};

// Function to handle the callback from Google
exports.GoogleCallback = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                password: null,
                profile_Picture: picture,
                role: 'Buyer',
                active: true,
            });
            await user.save();
        }

        let buyer = await Buyer.findOne({ userId: user._id });
        if (!buyer) {
            buyer = new Buyer({
                userId: user._id,
                firstName,
                lastName,
            });
            await buyer.save();
        } else {
            buyer.firstName = firstName;
            buyer.lastName = lastName;
            buyer.updatedAt = Date.now();
            await buyer.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Redirect to buyer page with token
        const redirectUrl = `${process.env.FRONTEND_URL}/buyer?user=${encodeURIComponent(
            JSON.stringify(user)
        )}&token=${token}`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
