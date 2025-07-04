const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Avoid circular imports
const User = require('./User');
const Event = require('./Event');

const Registration = sequelize.define('Registration', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Use table name as string
      key: 'id',
    },
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id',
    },
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: DataTypes.ENUM('registered', 'cancelled'),
    allowNull: false,
    defaultValue: 'registered',
  },
}, {
  tableName: 'event_registrations',
  timestamps: false, // We already use registration_date
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'event_id'],
    },
  ],
});

// Associations
User.hasMany(Registration, { foreignKey: 'user_id' });
Event.hasMany(Registration, { foreignKey: 'event_id' });

Registration.belongsTo(User, { foreignKey: 'user_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

module.exports = Registration;
