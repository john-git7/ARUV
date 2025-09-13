const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authh");
const User = require("../models/User");
const Product = require("../models/Product");
const { cancelOrder } = require("../controllers/authController");

// Book a product
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(req.params.productId);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Add product to user's bookedProducts
    user.bookedProducts = user.bookedProducts || [];
    user.bookedProducts.push({
      product: product._id,
      cropName: product.cropName,
      price: product.price,
      quantity: product.quantity,
      image: product.images[0],
    });

    await user.save();
    res.json({ msg: "Product booked successfully", bookedProducts: user.bookedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// router.delete("/:productId", auth, cancelOrder);

module.exports = router;
