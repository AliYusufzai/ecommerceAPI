const router = require("express").Router();
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const CryptoJS = require("crypto-js");

//send password link
router.post("/send", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email")
    });
    const { error } = emailSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(409)
        .send({ message: "User with given email does not exist" });

    const url = `${process.env.BASE_URL}password-reset`;
    await sendEmail(user.email, "Password Reset", url);

    res.status(200).send({ message: "password reset link sent to your email" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//verify URL
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "invalid link" });
    res.status(200).send({ message: "Valid Url" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//reset Password
router.post("/:id", async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password")
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "invalid link" });

    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
    user.password = req.body.password;
    await user.save();

    res.status(200).send({ message: "password reset successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
module.exports = router;
