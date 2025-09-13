const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectRoutes");
const landRoutes = require("./routes/landRoutes");
const bookingRoutes = require("./routes/bookings");
const { cancelOrder } = require("./controllers/authController");

const path = require("path");
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/lands",landRoutes);
app.use("/api/products", projectRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
