// config/postgres.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import { createUserModel } from '../model/userSchema';

// Use DB_URL from .env for flexibility
const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
});

// Define model
const UserModel = createUserModel(sequelize);

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
