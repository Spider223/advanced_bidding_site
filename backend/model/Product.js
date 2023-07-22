const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: String,
    },
    lastBidder: {
      type: String,
    },
    duration: {
      type: String,
      required: true,
    },
    remainingTime: {
      type: Number,
    },
    auctionStarted: {
      type: Boolean,
      default: false,
    },
    auctionEnded: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
    },
    username: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
