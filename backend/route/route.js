const express = require('express');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getUserRegistrations,
} = require('../controllers/eventController');


const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route: Fetch all events (with filters)
router.get('/', getEvents);

// Protected routes (require token)
router.post('/', authenticateToken, createEvent);                  // Admin
router.put('/:id', authenticateToken, updateEvent);                // Admin
router.delete('/:id', authenticateToken, deleteEvent);             // Admin
router.post('/:id/register', authenticateToken, registerForEvent); // User
router.get('/registrations', authenticateToken, getUserRegistrations); // User

module.exports = router;
