const express = require('express');
const router = express.Router();
const citiesController = require('../controllers/cityController');

// Define route for fetching cities
router.get('/cities', citiesController.getCities);

module.exports = router;
