// controllers/profileController.js
exports.getProfile = (req, res) => {
  res.render("profile", { user: req.user });
};
