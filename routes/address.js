const Address = require("../models/Address");
const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("./verifyToken");
const router = require("express").Router();
const mongoose = require("mongoose");

//CREATE & UPDATE ADDRESS
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = await Address.findOne({ userId });
    if (addressData) {
      var addAddress = [];
      for (let i = 0; i < addressData.address.length; i++) {
        addAddress.push(addressData.address[i]);
      }
      addAddress.push(req.body.address);
      const updated_address = await Address.findOneAndUpdate(
        { userId },
        { $set: { address: addAddress } }
      );

      res.status(200).json(updated_address);
    } else {
      const address = new Address({
        userId: req.user.id,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        country: req.body.country,
        post: req.body.postal,
        phone: req.body.phone
      });
      const saveAddress = await address.save();
      res.status(200).json(saveAddress);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.params.userId });
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post("/address", verifyTokenAndAuthorization, async (req, res) => {
//   const userId = req.user.id;
//   await Address.findOne({ userId })
//     .populate("User")
//     .then((user) => {
//       res.json(user);
//     });
//   const newAddress = await Address.create({
//     userId
//   });
// });
module.exports = router;
