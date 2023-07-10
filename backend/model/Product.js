const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  description: String,
  basePrice: String,
  duration: String,
  category: String,
});

module.exports = mongoose.model("Product", productSchema);
