const express = require('express');
// ✅ Correct
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controller/eventController');

const {
  registerForEvent,
  getUserRegistrations
} = require('../controller/registrationController');

const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Public
router.get('/', getEvents);

// Authenticated
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

router.post('/:id/register', authenticateToken, registerForEvent);
router.get('/registrations', authenticateToken, getUserRegistrations);

module.exports = router;
