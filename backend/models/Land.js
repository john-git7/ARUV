const mongoose = require("mongoose");

const LandSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the farmer/landowner
      required: true,
    },
    landSize: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    profitShare: { type: String, required: true },
    images: [{ type: String }], // store image paths
  },
  { timestamps: true }
);

module.exports = mongoose.model("Land", LandSchema);
