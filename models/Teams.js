const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../utils/database');

const Teams = sequelize.define('Teams', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  LeadId: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  Active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  CreatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
}, {
  timestamps: false
});

module.exports = {
  Teams,
};
