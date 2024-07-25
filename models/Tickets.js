const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Tickets = sequelize.define('Tickets', {
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
    Taskname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Duedate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Priority: {
      type: DataTypes.ENUM('High', 'Medium', 'Low'),
      allowNull: false
    },
    Status: {
      type: DataTypes.ENUM('Not started yet', 'In progress', 'Completed', 'Completion Requested'),
      defaultValue: 'Not started yet'
    },
    Details: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false 
  });
  

  module.exports = {
    Tickets,
  };