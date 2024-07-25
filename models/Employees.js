const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/database');

const Employees = sequelize.define('Employees', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TeamId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    Position: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    Contact: {
      type: DataTypes.STRING(20),
      defaultValue: null
    },
    DOJ: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    Salary: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: null
    },
    CNIC: {
      type: DataTypes.STRING(15),
      defaultValue: null
    },
    HomeAddress: {
      type: DataTypes.TEXT,
      defaultValue: null
    },
    GitHubUsername: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    BankAccountName: {
      type: DataTypes.STRING(100),
      defaultValue: null
    },
    BankAccountNo: {
      type: DataTypes.STRING(50),
      defaultValue: null
    },
    ProfileImage: {
      type: DataTypes.STRING(255),
      defaultValue: null
    }
  });


  module.exports = {
    Employees,
  };