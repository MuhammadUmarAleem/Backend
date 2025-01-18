const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation', // Reference to the Conversation model
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        attachment: {
            type: String, // URL or file path for the attachment
            required: false, // Optional field
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Users who have read the message
            },
        ],
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
