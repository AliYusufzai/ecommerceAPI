const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  manufacturer: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: Array },
  availability: {type: String, required: true },
  review: { type: Number },
  material: { type: String, required: true },
  frameShape: { type: String, required: true }, 
  frameType: { type: String, required: true },
  lensMaterial: {type: String, required: true },
  lensColor: {type: String, required: true },
  lensType: { type: String, required: true },
  prescriptionType: { type: String, required: true },
  frameWidth: { type: String, required: true },
  frameHeight: { type: String, required: true },
  categories: { type: Array },
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
}, {timestamps: true});

module.exports = mongoose.model("Product", ProductSchema);
