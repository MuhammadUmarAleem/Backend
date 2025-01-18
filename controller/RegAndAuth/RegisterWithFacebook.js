const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models/User');
const Buyer = require('../../models/Buyer');

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:4000/api/v1/registerWithFacebook/callback',
            profileFields: ['id', 'displayName', 'photos', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const { email, name } = profile._json;

            try {
                let user = await User.findOne({ email });
                if (!user) {
                    user = new User({
                        email,
                        password: null,
                        profile_Picture: profile.photos[0].value,
                        role: 'Buyer',
                        active: true,
                    });
                    await user.save();
                }

                let buyer = await Buyer.findOne({ userId: user._id });
                if (!buyer) {
                    const [firstName, ...lastNameParts] = name.split(' ');
                    const lastName = lastNameParts.join(' ');

                    buyer = new Buyer({
                        userId: user._id,
                        firstName,
                        lastName,
                    });
                    await buyer.save();
                }
                return done(null, user);
            } catch (error) {
                console.error('Error during Facebook OAuth:', error);
                return done(error, false);
            }
        }
    )
);

exports.FacebookLogin = passport.authenticate('facebook', { scope: ['email'] });

exports.FacebookCallback = (req, res) => {
    passport.authenticate('facebook', async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error during Facebook authentication' });
        }
        if (!user) {
            return res.status(400).json({ message: 'User authentication failed' });
        }

        try {
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
            console.error('Error generating token:', error);
            res.status(500).json({ message: 'Token generation error' });
        }
    })(req, res);
};
