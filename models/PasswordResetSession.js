const mongoose = require('mongoose');

// Define the PasswordResetSession schema
const passwordResetSessionSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        maxlength: 64,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        ref: 'User', // Reference to the User model (make sure the User model is defined)
    },
    createdTime: {
        type: Date,
        default: Date.now,
    },
});

// Create the PasswordResetSession model
const PasswordResetSession = mongoose.model('PasswordResetSession', passwordResetSessionSchema);

module.exports = PasswordResetSession;
