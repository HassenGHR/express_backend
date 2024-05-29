const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
// Route to fetch products
router.get("/products", productController.fetchProducts);
router.post('/update-data', productController.updateData);
router.get('/products/:productId', productController.getProductById);
router.post('/products/create', productController.createProduct);
router.put('/products/update/:productId', productController.updateProduct);
router.delete('/products/delete/:productId', productController.deleteProduct);
router.post('/products/:productId/reviews', productController.createReviewForProduct);
router.get("/products/:productId/reviews", productController.getReview);




module.exports = router;
