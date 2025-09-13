const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const auth = require("../middleware/authh");

const router = express.Router();

// ⚡ Serve uploaded images
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 🟢 GET: Fetch all products (no auth needed for consumers)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ➡️ POST: Upload new product (farmer only)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { cropName, quantity, price } = req.body;
    if (!cropName || !quantity || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imagePaths = req.files.map((f) => `/uploads/${f.filename}`);

    const newProduct = new Product({
      farmerId: req.user.id,
      cropName,
      quantity,
      price,
      images: imagePaths,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
