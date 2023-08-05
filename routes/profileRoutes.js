// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

// Routes
router.get("/", profileController.getProfile);

module.exports = router;
