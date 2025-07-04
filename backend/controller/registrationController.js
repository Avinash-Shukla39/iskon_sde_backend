const Registration = require('../models/Registrations'); // ✅ plural
const Event = require('../models/Events');
const Location = require('../models/locations'); // ✅ to include event location info

// @desc Register user for an event
// @route POST /events/:id/register
exports.registerForEvent = async (req, res) => {
  const userId = req.user.id;
  const eventId = parseInt(req.params.id);

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existing = await Registration.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      user_id: userId,
      event_id: eventId,
    });

    return res.status(201).json({
      message: 'Registered successfully',
      registration,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc Get all registrations for logged-in user
// @route GET /events/registrations
exports.getUserRegistrations = async (req, res) => {
  const userId = req.user.id;

  try {
    const registrations = await Registration.findAll({
      where: { user_id: userId },
      include: [{
        model: Event,
        include: [Location]  // include location details with event
      }],
    });

    return res.status(200).json(registrations);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
