// models/Brand.js

const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true, // To automatically create createdAt and updatedAt fields
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
