const mongoose = require('mongoose');

// Define the Admin schema
const AdminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    default: null,
    trim: true
  },
  address: {
    type: String,
    default: null,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  primaryOrganization: {
    type: String,
    required: true,
    trim: true
  },
  administrator: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create the Admin model
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
