const express = require('express');
const router = express.Router();

// Auth controller
const { register, login } = require('../controller/authController');

// @route   POST /auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /auth/login
// @desc    Authenticate user & return JWT
// @access  Public
router.post('/login', login);

module.exports = router;
