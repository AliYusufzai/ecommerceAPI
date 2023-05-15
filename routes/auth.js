const router = require("express").Router();
const jwt = require("jsonwebtoken");
//Importing user model
const User = require("../models/User");
//importing crypto to encrypt password
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/registration", async (req, res) => {
  //creating instance of user model object
  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    phone: req.body.phone,
    country: req.body.country,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    //saving the input from user into database using save method
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    //find the user in database
    const user = await User.findOne({ username: req.body.username });
    //if user is not matched, show this msg
    !user && res.status(401).json("Wrong Credentials");
    //decrypt the password we got in user object
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    //return the password into string using toString function
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    //if the password is not correct show this error msg
    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong Credentials");
    //generate token when the user logs in which expires in 3 days
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    //destructring user object to hide the password from user
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
