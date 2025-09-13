const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }], // store image URLs or paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", projectSchema);
