const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  userId: mongoose.Schema.Types.ObjectId,
  url: String,
  name: String,
  currentPrice: Number,
  desiredPrice: Number,
});

module.exports = Product;
