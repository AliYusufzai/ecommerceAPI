const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    catName: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
