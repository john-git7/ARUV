const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["farmer", "consumer"], required: true },
    city: { type: String, required: true },

    // Farmer-specific fields
    farmName: {
      type: String,
      required: function () {
        return this.role === "farmer";
      },
    },
    farmAddress: {
      type: String,
      required: function () {
        return this.role === "farmer";
      },
    },

    // Consumer-specific fields
    deliveryAddress: {
      type: String,
      required: function () {
        return this.role === "consumer";
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
