const User = require("../models/User");

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id; // comes from authMiddleware
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // remove from bookedProducts
    user.bookedProducts = user.bookedProducts.filter(
      (prod) => prod._id.toString() !== productId
    );

    await user.save();

    res.json({
      message: "Order cancelled successfully",
      bookedProducts: user.bookedProducts,
    });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
};