// config/postgres.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import { createUserModel } from '../model/userSchema.js';
// Import model factory functions
import { UserModel } from '../models/User.js';
import { EventModel } from '../models/Events.js';
import { RegistrationModel } from '../models/Registrations.js';
import { LocationModel } from '../models/locations.js';

// Use DB_URL from .env for flexibility
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

// Define model
const UserModel = createUserModel(sequelize);

// Initialize all models
const User = UserModel(sequelize);
const Event = EventModel(sequelize);
const Registration = RegistrationModel(sequelize);
const Location = LocationModel(sequelize);



// Define associations
User.hasMany(Event, { foreignKey: 'created_by' });
Event.belongsTo(User, { foreignKey: 'created_by' });

Location.hasMany(Event, { foreignKey: 'location_id' });
Event.belongsTo(Location, { foreignKey: 'location_id' });

User.belongsToMany(Event, {
  through: Registration,
  foreignKey: 'user_id',
});
Event.belongsToMany(User, {
  through: Registration,
  foreignKey: 'event_id',
});


// Export all models and sequelize instance
export { sequelize, User, Event, Registration, Location };

// Optional: DB connection test
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
  } catch (err) {
    console.error('❌ DB connection error:', err);
  }
};

export {
  sequelize,
  connectDB,
  UserModel
};
