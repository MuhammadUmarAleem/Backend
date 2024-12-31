const mongoose = require('mongoose');

// Define the EmailVerificationSession schema
const emailVerificationSessionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        maxlength: 64,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'User',
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
});

// Create the EmailVerificationSession model
const EmailVerificationSession = mongoose.model('EmailVerificationSession', emailVerificationSessionSchema);

module.exports = EmailVerificationSession;
