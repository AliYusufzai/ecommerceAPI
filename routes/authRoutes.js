// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const config = require("../middleware/passport");
const jwt = require("jsonwebtoken");

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    config.google,
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // User doesn't exist, create a new user with Google OAuth data
          user = await User.create({
            firstname: profile.name.givenName, // Add firstname from Google profile
            lastname: profile.name.familyName, // Add lastname from Google profile
            username: profile.displayName.replace(/\s+/g, ""), // Generate a username from the displayName
            phone: null, // Add any other fields you require from the profile object (set to null or default)
            country: null, // Add country field (set to null or default)
            email: profile.emails[0].value, // Add email from Google profile
            password: null, // Add password field (set to null or default)
            confirmpassword: null, // Add confirmpassword field (set to null or default)
            wishlist: [], // Add wishlist field (set to an empty array or default)
            checked: "false", // Add checked field (set to a default value)
            isAdmin: false, // Add isAdmin field (set to a default value)
            googleId: profile.id, // Store the Google ID of the user
            googleEmail: profile.emails[0].value, // Store the user's email obtained from Google OAuth
            googleName: profile.displayName // Store the user's name obtained from Google OAuth
          });
        }
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );
        return done(null, user, accessToken);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize and Deserialize user
// (No changes needed for serializeUser and deserializeUser)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
// Routes
router.get("/google", authController.googleLogin);
router.get("/google/callback", authController.googleCallback);
router.get("/logout", authController.logout);

module.exports = router;
