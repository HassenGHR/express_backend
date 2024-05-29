const mongoose = require('mongoose');

// Define the city schema
const citySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  commune_name_ascii: {
    type: String,
    required: true,
  },
  commune_name: {
    type: String,
    required: true,
  },
  daira_name_ascii: {
    type: String,
    required: true,
  },
  daira_name: {
    type: String,
    required: true,
  },
  wilaya_code: {
    type: String,
    required: true,
  },
  wilaya_name_ascii: {
    type: String,
    required: true,
  },
  wilaya_name: {
    type: String,
    required: true,
  },
});

// Create the City model
const City = mongoose.model('City', citySchema);

module.exports = City;
