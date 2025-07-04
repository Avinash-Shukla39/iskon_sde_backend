const { Op } = require('sequelize');
const Event = require('../models/Events');
const Registration = require('../models/Registrations');
const User = require('../models/User');
const Location = require('../models/locations');

// GET /events?category=&location=&date=
exports.getEvents = async (req, res) => {
  try {
    const { category, location, date } = req.query;

    const where = {};
    if (category) where.category = category;
    if (date) where.date = date;

    const events = await Event.findAll({
      where,
      include: [
        {
          model: Location,
          where: location ? { city: location } : undefined,
          required: !!location,
        }
      ],
      order: [['date', 'ASC']],
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('getEvents error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// POST /events (admin only)
exports.createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, description, date, category, location_id } = req.body;

    if (!title || !description || !date || !category || !location_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      category,
      location_id,
      created_by: req.user.id,
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('createEvent error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// PUT /events/:id (admin only)
exports.updateEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.update(req.body);
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error('updateEvent error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// DELETE /events/:id (admin only)
exports.deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// POST /events/:id/register (user only)
exports.registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Only users can register for events' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existing = await Registration.findOne({
      where: {
        user_id: req.user.id,
        event_id: req.params.id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    const registration = await Registration.create({
      user_id: req.user.id,
      event_id: req.params.id,
    });

    res.status(201).json({ message: 'Successfully registered for the event', registration });
  } catch (error) {
    console.error('registerForEvent error:', error);
    res.status(500).json({ error: 'Failed to register for the event' });
  }
};

// GET /events/registrations (user only)
exports.getUserRegistrations = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Only users can view registrations' });
    }

    const registrations = await Registration.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Event,
          include: [Location]
        }
      ],
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error('getUserRegistrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};
