const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndAuth,
  verifyTokenAndAuthWithUser
} = require("./verifyToken");
const router = require("express").Router();

//CREATE CART
// router.post("/", verifyToken, async (req, res) => {
//   const newCart = new Cart(req.body);
//   try {
//     const savedCart = await newCart.save();
//     res.status(200).json(savedCart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//CREATE & UPDATE CART - TESTED
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const productId = req.body.products.productId;
  const quantity = req.body.products.quantity;
  const userId = req.user.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId,
        products: [{ productId, quantity }]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

//UPDATE CART
// router.put("/:id", verifyTokenAndAuth, async (req, res) => {
//   const id = req.params.id;
//   const prod = {
//     products: req.body.products
//   };
//   console.log(id);
//   console.log(prod);
//   try {
//     const updatedCart = await Cart.findOneAndUpdate(
//       { userId: id },
//       {
//         $set: { "products.$": prod }
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedCart);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE CART ITEMS
// router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
//   const id = req.params.id;
//   const { cartId } = req.body;
//   try {
//     const deleteProduct = await Cart.findOneAndUpdate(
//       { userId: id },
//       { $pull: { products: { _id: cartId } } }
//     );
//     res.status(200).json("Cart has Been Deleted");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//DELETE USER CART - TESTED
router.delete("/delete", verifyTokenAndAuthWithUser, async (req, res) => {
  const { id } = req.user;
  const { cartId } = req.body;
  try {
    const deleteProduct = await Cart.findOneAndUpdate(
      { userId: id },
      { $pull: { products: { _id: cartId } } }
    );
    res.status(200).json("Cart has Been Deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

//GET USER CART - TESTED
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CART - TESTED
router.get("/find/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
