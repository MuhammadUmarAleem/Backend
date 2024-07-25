const { Sequelize,DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Comments = sequelize.define('Comments', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false // Disable automatic timestamps
  });


  module.exports = {
    Comments,
  };