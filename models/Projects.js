const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Projects = sequelize.define('Projects', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    TeamId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    PMId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    StartingDate: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    EndDate: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    Status: {
      type: DataTypes.ENUM('Not Started Yet', 'In Progress', 'Completed'),
      allowNull: false
    },
    ProjectType: {
      type: DataTypes.ENUM('Single', 'Milestones'),
      allowNull: false
    },
    GitHubRepo: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    ClientID: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    Active: {
      type: DataTypes.BOOLEAN,
      defaultValue: null
    }
  }, {
    timestamps: false
  });

  module.exports = {
    Projects,
  };