const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    password: {
        type: String,
        maxlength: 80,
        default: null,
    },
    username: { type: String, required: true, unique: true },
    profile_Picture: {
        type: String,
        maxlength: 300,
        default: null,
    },
    role: {
        type: String,
        enum: ['Admin', 'Seller', 'Buyer'],
        default: 'Buyer', // Default role is Buyer
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
