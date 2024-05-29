const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECRET;

// Hash a password using JWT secret
async function hashPassword(password) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

// Verify a password using JWT secret
async function verifyPassword(password, hashedPassword) {
  try {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    return passwordMatch;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

module.exports = { hashPassword, verifyPassword };
