const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Attendance = sequelize.define('Attendance', {
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
    Status: {
      type: DataTypes.ENUM('Present', 'Absent', 'Leave'),
      defaultValue: null
    }
  });

  module.exports = {
    Attendance,
  };