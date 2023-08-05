// controllers/authController.js
const passport = require("passport");
const config = require("../middleware/passport");

exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

exports.googleCallback = passport.authenticate("google", {
  failureRedirect: "/",
  successRedirect: "/profile"
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
};
