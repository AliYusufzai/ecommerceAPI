const router = require("express").Router();
const User = require("../models/User");
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  const newContact = Contact(req.body);
  try {
    const saveContact = await newContact.save();
    res.status(200).json({ success: "Your Feedback has been received" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
