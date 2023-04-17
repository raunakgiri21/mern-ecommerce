const passport = require('passport')
const User = require('../models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/redirect"
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ google_ID: profile.id }).then((currentUser) => {
      if(currentUser){
        // console.log("User is: ",currentUser)
        done(null,currentUser)
      }
      else{
        new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          google_ID: profile.id,
        }).save().then((newUser) => {
          // console.log('new user created:' + newUser)
          done(null,newUser)
        })
      }
    })
    return console.log(done)
  }
));