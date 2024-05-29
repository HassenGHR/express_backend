const express = require('express');
const router = express.Router();
const wilayasController = require('../controllers/wilayaController');

// Define route for fetching wilayas by ID
router.get('/wilayas/:wilayaId', wilayasController.getWilayaById);
router.get('/wilayas/:wilaya_code/:fee_type', wilayasController.getCommunesAndFeesByWilaya);


module.exports = router;
