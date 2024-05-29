const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadImageController');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
});

// Upload endpoint
router.post('/upload', upload.single('image'), uploadController.uploadFile);

module.exports = router;
