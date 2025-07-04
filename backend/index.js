require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Routes
const authRoutes = require('./route/authRoutes');
const eventRoutes = require('./route/eventsRoutes');
const registrationRoutes = require('./route/registrationRoutes'); // ✅ new

const app = express();
app.use(cors());
app.use(express.json());

// Route prefixes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/events', registrationRoutes); // POST /:id/register, GET /registrations

// DB Connection and Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // ✅ auto create/update tables
  .then(() => {
    console.log('✅ Database synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB:', err);
  });
