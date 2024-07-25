const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Requests = sequelize.define('Requests', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Reason: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Approved', 'Rejected'),
      defaultValue: null
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    RequestName: {
      type: DataTypes.STRING(255),
      defaultValue: null
    }
  }, {
    timestamps: false
  });

  module.exports = {
    Requests,
  };