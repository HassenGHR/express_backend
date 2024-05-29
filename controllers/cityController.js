const City = require('../models/cityModel');

async function getCities(req, res) {
  try {
    // Fetch cities from the database
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  getCities,
};
