const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: {
      type: Array
    },
    country: { type: String, required: true },
    postal: { type: Number },
    phone: { type: Number, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
