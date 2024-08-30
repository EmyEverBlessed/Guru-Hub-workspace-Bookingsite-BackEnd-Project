const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to register a new user
router.post('/register', userController.registerUser);

// Route to authenticate a user
router.post('/login', userController.loginUser);

// Route to retrieve user profile details
router.get('/:id', userController.getUserProfile);

// Route to update user profile details
router.put('/:id', userController.updateUserProfile);

// Route to log out a user
router.post('/logout', userController.logoutUser);

module.exports = router;
