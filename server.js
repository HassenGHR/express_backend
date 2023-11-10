const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();
const { Pool } = require('pg');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// Generate a random string for JWT secret key
const jwtSecretKey = process.env.JWT_SECRET

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user data to PostgreSQL database
    await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);

    res.json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Check if the user exists
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.rows[0].id }, jwtSecretKey, { expiresIn: '1h' });

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve the JSON file
app.get('/api/data', (req, res) => {
  const jsonData = require('./data/products.json'); 
  res.json(jsonData);
});

// Serve the cities JSON file
app.get('/api/cities', (req, res) => {
    const citiesData = require('./data/cities.json');
    res.json(citiesData);
  });

// Update the products data
app.post('/api/update-data', (req, res) => {
  const updatedData = req.body; // Updated data sent from the client

  // Read the existing products data from the file
  const existingData = require('./data/products.json');

  // Update the existing data with the new data
  existingData.products = updatedData;

  // Write the updated data back to the file
  fs.writeFile('./data/products.json', JSON.stringify(existingData), (err) => {
    if (err) {
      console.error('Error updating JSON:', err);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      console.log('Data updated successfully');
      res.json({ message: 'Data updated successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
