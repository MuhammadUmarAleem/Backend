const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Documents = sequelize.define('Documents', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    DocumentLink: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
  

  module.exports = {
    Documents,
  };