// models/Users.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Users = sequelize.define('Users', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  FirstName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  Password: {
    type: DataTypes.CHAR(64),
    allowNull: false
  },
  Role: {
    type: DataTypes.ENUM('SuperAdmin', 'Admin', 'ProjectManager', 'Employee'),
    allowNull: false
  },
  Active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  UpdatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = { Users };
