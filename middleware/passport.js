const GoogleStrategy = require("passport-google-oauth2").Strategy;
const passport = require("passport");
require("dotenv").config();

const GOOGLE_CLIENT_ID =
  "731526907781-h8602gs512ckm0d69c0u12npqg3pq8sv.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

module.exports = {
  sessionSecret: "ludwigdieter",
  google: {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  }
};

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/auth/google/callback",
//       passReqToCallback: true
//     },
//     function (request, accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
