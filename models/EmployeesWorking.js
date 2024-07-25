// models/EmployeesWorking.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const EmployeesWorking = sequelize.define('EmployeesWorking', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ProjectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  EmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = {
  EmployeesWorking
};
