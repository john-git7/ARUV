const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Land = require("../models/Land");
const User = require("../models/User");
const auth = require("../middleware/authh");
const router = express.Router();

const uploadPath = path.join(process.cwd(), "uploads/land");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ➡️ POST: Add new land
router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { landSize, location, duration, profitShare } = req.body;

    const landSizeNum = Number(landSize);
    const durationNum = Number(duration);
    const profitShareNum = Number(profitShare);

    if (!location || isNaN(landSizeNum) || isNaN(durationNum) || isNaN(profitShareNum)) {
      return res.status(400).json({ message: "All fields are required and must be valid numbers" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    const exists = await Land.findOne({
      ownerId: req.user.id,
      location,
      landSize: landSizeNum,
    });

    if (exists) return res.status(400).json({ message: "You already listed this land" });

    const imagePaths = req.files.map((f) => `/uploads/land/${f.filename}`);

    const newLand = new Land({
      ownerId: req.user.id,
      landSize: landSizeNum,
      location,
      duration: durationNum,
      profitShare: profitShareNum,
      images: imagePaths,
    });

    await newLand.save();
    res.status(201).json({ message: "Land listed successfully", land: newLand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ➡️ GET: All lands
router.get("/", async (req, res) => {
  try {
    const lands = await Land.find();
    res.json(lands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST: Adopt a land/crop
router.post("/adopt/:id", auth, async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ message: "Land not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure bookedProducts array exists
    user.bookedProducts = user.bookedProducts || [];

    // Prevent duplicate adoption
    const alreadyAdopted = user.bookedProducts.some(
      (p) => p.landId?.toString() === land._id.toString()
    );
    if (alreadyAdopted) return res.status(400).json({ message: "You already adopted this crop" });

    // Add land to user's bookedProducts
    user.bookedProducts.push({
      landId: land._id,
      cropName: land.location,
      price: land.profitShare, // or any other price logic
      quantity: land.landSize,
      image: land.images[0] || "",
    });

    await user.save();
    res.json({ message: "Crop adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE: Remove a land (only by owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) return res.status(404).json({ message: "Land not found" });

    // Only owner can delete
    if (land.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this land" });
    }

    // Delete images from server
    land.images.forEach((imgPath) => {
      const filePath = path.join(process.cwd(), imgPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await Land.findByIdAndDelete(req.params.id);
    res.json({ message: "Land deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
