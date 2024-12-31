const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;  

const TWITTER_CONSUMER_KEY = "MhDPVLedvp5WJfcLyh2AD7lqg";
const TWITTER_CONSUMER_SECRET = "X1aNoxgYwrbKK5YtFhmN9EFt64FJGvOfz9w2MqAbch1gD3SAbv";

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:4000/auth/twitter/callback",
    includeEmail: true  
  },
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  const user = { id: id, displayName: 'Sample User', emails: [{ value: 'sample@example.com' }] };  
  done(null, user);
});
