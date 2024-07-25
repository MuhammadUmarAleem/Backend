const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Clients = sequelize.define('Clients', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Contact: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    Email: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    CountryName: {
      type: DataTypes.STRING(100),
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
    Clients,
  };