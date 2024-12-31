const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../models/User');

// Configure Facebook OAuth using Passport
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/api/v1/registerWithFacebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'] // Request necessary profile fields
  },
  async (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json; // Extract email and name from profile

    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ email });

      if (!user) {
        // Create a new user if they don't exist
        user = new User({
          email,
          password: null, // No password needed for Facebook OAuth users
          profile_Picture: profile.photos[0].value, // Get the user's Facebook profile picture
          role: 'Buyer',
          active: true,
        });
        await user.save();
      }

      // Pass the user object to Passport for session management
      return done(null, user);
      
    } catch (error) {
      console.error('Error during Facebook OAuth:', error);
      return done(error, false);
    }
  }
));

// Function to initiate Facebook Login
exports.FacebookLogin = passport.authenticate('facebook', { scope: ['email'] });

// Function to handle the Facebook callback
exports.FacebookCallback = (req, res) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error during Facebook authentication' });
    }
    if (!user) {
      return res.status(400).json({ message: 'User authentication failed' });
    }

    // Respond with user details upon successful login
    res.status(200).json({ message: 'User authenticated and registered successfully', user });
  })(req, res);
};
