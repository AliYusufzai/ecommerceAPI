const Cat = require("../models/Category");
const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newCategory = Cat(req.body);
  try {
    const saveCategory = await newCategory.save();
    res.status(200).json(saveCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
