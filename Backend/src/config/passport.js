const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/google/callback",
    proxy: true
  },
async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
        }
        return done(null, user);
      } 
      let photoUrl = profile._json.picture || profile.photos[0]?.value;
      // CREATE NEW USER
      user = await User.create({
        name: profile.displayName, 
        email: profile.emails[0].value,
        profilePhoto: photoUrl,
        googleId: profile.id, 
        password: crypto.randomBytes(16).toString('hex') 
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});