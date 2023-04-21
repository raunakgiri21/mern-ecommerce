const passport = require('passport')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
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
    callbackURL: "/api/v1/auth/google/redirect",
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    User.findOne({ google_ID: profile.id }).then((currentUser) => {
      if(currentUser){
        // console.log("User is: ",currentUser)
        const user = {
          userID: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          address: currentUser.address,
        }
        const token = jwt.sign(currentUser.id,process.env.JWT_SECRET)
        done(null,{user,token: token})
      }
      else{
        new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          google_ID: profile.id,
        }).save().then((newUser) => {
          // console.log('new user created:' + newUser)
          const user = {
            userID: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            address: newUser.address,
          }
          const token = jwt.sign(newUser.id,process.env.JWT_SECRET)
          done(null,{user,token: token})
        })
      }
    })
    return console.log(done)
  }
));