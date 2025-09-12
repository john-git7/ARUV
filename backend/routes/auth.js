const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expect: "Bearer <token>"
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// @route   POST /api/auth/signup
// backend/routes/auth.js
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, password, role } = req.body;

    // check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    user = new User({
      firstName,
      lastName,
      email,
      phone,
      city,
      role,
      password: hashedPassword, // ✅ hashed
      farmName: req.body.farmName || undefined,
  farmAddress: req.body.farmAddress || undefined,
  deliveryAddress: req.body.deliveryAddress || undefined,
    });

    await user.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
