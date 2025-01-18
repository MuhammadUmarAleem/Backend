const mongoose = require('mongoose');

// Define the Buyer schema
const buyerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  firstName: {
    type: String,
    default: null,
    trim: true
  },
  lastName: {
    type: String,
    default: null,
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
    default: null,
    trim: true
  },
  primaryOrganization: {
    type: String,
    default: null,
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

// Create the Buyer model
const Buyer = mongoose.model('Buyer', buyerSchema);

module.exports = Buyer;
