const User = require('../models/UserModel');
const {  verifyPassword } = require('../utils/passwordUtils');
const {  hashPassword } = require('../utils/passwordUtils');
const  {generateToken} = require('./generateToken');


const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the phone number already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }


    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user with hashed password and OTP
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    const token = generateToken({newUser});


    res.status(200).json({ token, userId: newUser._id, isAdmin: newUser.isAdmin, name: newUser.name });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Find the user with the provided phone number
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
      const token = generateToken({user});
      console.log(token)

  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by phone number
      const user = await User.findOne({ email });
  
      // Verify password
      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }
  
      // Generate and send JWT token for authentication
      const token = generateToken({user});
  
      res.status(200).json({ token, userId: user._id,  isAdmin: user.isAdmin, name: user.name });
    } catch (error) {
      console.error('Error during sign-in:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  const getUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const updateUserProfile = async (req, res) => {
    try {
      const newData = req.body; // New user data sent from the client
      const userId = req.params.userId;
       // Check if password is empty, if so, remove it from newData
    if (newData.password === '') {
      delete newData.password;
    }
  
      // Update the user profile with the new data
      const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      const token = generateToken({updatedUser});

  
      res.status(200).json({ token, userId: userId,  isAdmin: updatedUser.isAdmin, name: updatedUser.name });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const deleteUserById = async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Find the user by ID and delete it
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const updateUserById = async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
  
    try {
      // Find the user by ID and update it
      const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

module.exports = { signIn, signUp, getUserById, updateUserProfile, getUsers, deleteUserById ,updatePassword,updateUserById};
