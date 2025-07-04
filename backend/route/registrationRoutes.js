const express = require('express');
const {
  registerForEvent,
  getUserRegistrations,
} = require('../controller/registrationController');


const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /events/:id/register
router.post('/:id/register', authenticateToken, registerForEvent);

// GET /events/registrations
router.get('/registrations', authenticateToken, getUserRegistrations);

module.exports = router;
