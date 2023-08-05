const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true },
    phone: { type: Number, unique: true },
    country: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    confirmpassword: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    checked: { type: String, default: "false" },
    isAdmin: {
      type: Boolean,
      default: false
    },
    // New fields for Google OAuth data
    googleId: { type: String, unique: true }, // To store the Google ID of the user
    googleEmail: { type: String }, // To store the user's email obtained from Google OAuth
    googleName: { type: String }, // To store the user's name obtained from Google OAuth
    googleAccessToken: { type: String }, // To store the access token provided by Google OAuth
    googleRefreshToken: { type: String } // To store the refresh token provided by Google OAuth
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
