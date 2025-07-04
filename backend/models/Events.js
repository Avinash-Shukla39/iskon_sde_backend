const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Avoid circular imports during model registration
const User = require('./User');
const Location = require('./Location');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locations', // use table name (not model object)
      key: 'id',
    },
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'events',
  timestamps: true, // automatically adds createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: false, // you can enable this if needed
});

// Relationships
User.hasMany(Event, { foreignKey: 'created_by' });
Event.belongsTo(User, { foreignKey: 'created_by' });

Location.hasMany(Event, { foreignKey: 'location_id' });
Event.belongsTo(Location, { foreignKey: 'location_id' });

module.exports = Event;
