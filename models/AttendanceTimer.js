const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const AttendanceTimer = sequelize.define('AttendanceTimer', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    AttendanceId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    endTime: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    TotalWorkingHours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: null
    },
    StandupMessage: {
      type: DataTypes.STRING(255),
      defaultValue: null
    }
  });
  module.exports = {
    AttendanceTimer,
  };