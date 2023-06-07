const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndAuthWithUser
} = require("./verifyToken");
const router = require("express").Router();
const mongoose = require("mongoose");

//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = Product(req.body);
  try {
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories"
    );
    const relatedProduct = await Product.find({
      brand: product.brand || { categories: product.categories }
    });
    res.status(200).json({ product, relatedProduct });
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qOld = req.query.old;
  const qAsc = req.query.asc;
  const qDesc = req.query.desc;
  const qCategory = req.query.category;
  const qColor = req.query.color;
  const qPrice = req.query.price;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(10);
    } else if (qOld) {
      products = await Product.find().sort({ createdAt: 1 }).limit(10);
    } else if (qAsc) {
      products = await Product.find().sort({ title: 1 }).limit(10);
    } else if (qDesc) {
      products = await Product.find().sort({ title: -1 }).limit(10);
    } else if (qColor) {
      products = await Product.find({
        color: {
          $eq: qColor
        }
      });
    } else if (qCategory) {
      const cat = await Category.findOne({ catName: qCategory });
      if (cat) {
        products = await Product.find({ categories: cat._id }).populate(
          "categories"
        );
      }
    } else if (qPrice) {
      products = await Product.find({
        price: {
          $gte: 1,
          $lte: qPrice
        }
      });
    } else {
      products = await Product.find().skip(skip).limit(limit);
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//SEARCH PRODUCT
router.get("/search/:key", async (req, res) => {
  try {
    const cat = await Category.findOne({ catName: req.params.key });
    let products = await Product.find({
      $or: [
        { title: { $regex: req.params.key, $options: "i" } },
        { brand: { $regex: req.params.key, $options: "i" } },
        { categories: cat?._id }
      ]
    }).populate("categories");

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//FEATURED PRODUCT
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ feature: true });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PRODUCT REVIEWS
router.post("/review", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const { comment, productId } = req.body;
    const user = await User.findById({ _id: req.user.id });
    const review = {
      user: req.user.id,
      name: user.username,
      comment
    };
    const product = await Product.findById(productId);
    console.log(product);
    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );
    console.log(isReviewed);
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
    }
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//USER WISHLIST
router.post("/wishlist", verifyTokenAndAuthorization, async (req, res) => {
  const id = req.user.id;
  const { prodId } = req.body;
  try {
    const user = await User.findById(id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: prodId }
        },
        {
          new: true
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: prodId }
        },
        {
          new: true
        }
      );
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
