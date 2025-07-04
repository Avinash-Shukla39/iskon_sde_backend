import { DataTypes } from "sequelize";

export const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
