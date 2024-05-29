const express = require('express');
const signInController = require('../controllers/authController');

const router = express.Router();

router.post('/users/signin', signInController.signIn);
router.get('/users/:userId', signInController.getUserById);
router.put('/users/profile/:userId/update', signInController.updateUserProfile);
router.get('/users', signInController.getUsers);
router.delete('/users/:id', signInController.deleteUserById);
router.put('/users/update/:id', signInController.updateUserById);
router.post('/users/signup', signInController.signUp);
router.post('/users/update-password', signInController.updatePassword);







module.exports = router;
