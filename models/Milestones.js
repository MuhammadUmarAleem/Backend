const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Milestones = sequelize.define('Milestones', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    MilestoneName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    StartingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    EndingDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    MilestoneDetails: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    ProjectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false
  });
  

  module.exports = {
    Milestones,
  };