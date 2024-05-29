const Product = require('../models/ProductModel');
const Review = require('../models/reviewModel');


async function fetchProducts(req, res) {
  try {
    // Fetch products from the database using Mongoose
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

async function getProductById(req, res) {
  const productId = req.params.productId; // Extract the product ID from request parameters

  try {
    // Find the product by ID in the database
    const product = await Product.findById(productId);

    // If the product is not found, return a 404 status with a message
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is found, return it as JSON
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


async function updateData(req, res) {
  try {
    const { productId, purchasedQuantity } = req.body; // Product ID and purchased quantity sent from the client

    // Validate that the purchased quantity is a positive number
    if (purchasedQuantity < 0) {
      return res.status(400).json({ message: 'Purchased quantity must be a positive number' });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      console.error(`Product ${productId} not found`);
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate the updated quantity ensuring it never goes below 0
    const updatedQuantity = Math.max(0, product.quantity - purchasedQuantity);

    // Update the product quantity
    product.quantity = updatedQuantity;
    await product.save();

    console.log(`Product ${productId} quantity updated successfully`);
    res.json({ message: 'Product quantity updated successfully' });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
async function createProduct(req, res) {
  const requestData = req.body; // Extract product details from request body

  try {
    let productData = {};

    // Check if req.body is empty or has no properties
    if (Object.keys(requestData).length === 0 ) {
      // If req.body is empty, initialize product with default values
      productData = {
        id: 0,
        name: '',
        quantity: 0,
        price: '0',
        oldPrice: '0',
        brand: '',
        category: '',
        thumbnail: []
      };
    } else {
      // If req.body is not empty, use the provided data
      productData = requestData;
    }

    // Create a new product document with the prepared data
    const newProduct = new Product(productData);
    await newProduct.save();

    // Send the newly created product as a JSON response
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


async function updateProduct(req, res) {
  const productId = req.params.productId; // Extract product ID from request parameters
  const newData = req.body; // Extract updated product data from request body

  try {
    // Find the product by ID and update it with the new data
    const updatedProduct = await Product.findByIdAndUpdate(productId, newData, { new: true });

    // If the product is not found, return a 404 status with a message
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is updated successfully, return it as JSON
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

async function deleteProduct(req, res) {
  const productId = req.params.productId; // Extract product ID from request parameters

  try {
    // Find the product by ID and delete it
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // If the product is not found, return a 404 status with a message
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If the product is deleted successfully, return a success message
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
async function createReviewForProduct(req, res) {
  const { productId } = req.params; // Extract product ID from request parameters
  const { userId, name, rating, comment } = req.body; // Extract review details from request body

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the user has already made a review for this product
    const existingReview = await Review.findOne({ product: productId, user: userId });

    if (existingReview) {
      // Update the existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      // Update product rating
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await product.save();

      // Return the updated review
      return res.status(200).json(existingReview);
    } else {
      // Create a new review document
      const newReview = new Review({ product: productId, user: userId, name, rating, comment });
      await newReview.save();

      // Update product rating
      const reviews = await Review.find({ product: productId });
      product.numReviews = reviews.length;
      product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await product.save();

      // Return the created review
      return res.status(201).json(newReview);
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getReview(req, res) {
  const { productId } = req.params; 
  
  try {
    // Fetch reviews based on the productId and optionally userId
    const reviews = await Review.find({ product: productId}).exec();

    // Calculate the number of reviews
    const numReviews = reviews.length;

    // Calculate the average rating
    let totalRating = 0;
    reviews.forEach(review => {
      totalRating += review.rating;
    });
    const averageRating = numReviews > 0 ? totalRating / numReviews : 0;

    // Update the product's numReviews and rating
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.numReviews = numReviews;
    product.rating = averageRating;
    await product.save();

    // Return the reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




module.exports = {
  fetchProducts,
  updateData,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReviewForProduct,
  getReview
};
