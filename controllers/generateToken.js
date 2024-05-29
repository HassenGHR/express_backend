const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/UserModel');


function generateToken(payload) {
  try {
    // Generate a JWT token with the payload and JWT secret
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}
function getUserIdFromToken(token) {
  try {
    const decodedToken = jwt.verify(token, jwtSecret);
    // Assuming the user ID is stored in the 'sub' claim
    console.log(decodedToken.user._id)
    const userId = decodedToken.user._id;
    return userId;
  } catch (error) {
    // Handle token validation errors
    console.error('Error decoding token:', error.message);
    return null;
  }
}
const fetchUserInfo = async (req, res) => {
  // Extract the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Extract the user ID from the token
    const userId = getUserIdFromToken(token);
    console.log(userId)

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Query the database to find the user by ID
    const user = await User.findById(userId).select('_id name');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user found, send the user information in the response
    return res.status(200).json({ user });
  } catch (error) {
    // Handle errors
    console.error('Error fetching user information:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { generateToken, getUserIdFromToken, fetchUserInfo };
