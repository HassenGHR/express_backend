const mongoose = require('mongoose');

// Define the schema for the Wilaya model
const wilayaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  ar_name: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
});

// Create the Wilaya model using the schema
const Wilaya = mongoose.model('Wilaya', wilayaSchema);

module.exports = Wilaya;
