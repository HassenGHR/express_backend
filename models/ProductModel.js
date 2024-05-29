const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  quantity: Number,
  price: String,
  oldPrice: String,
  brand: String,
  category: String,
  thumbnail: [String],
  description: String,
  rating: {
    type: Number,
    max: 5,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
