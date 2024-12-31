const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        participants: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User', // Reference to User model
                    required: true,
                },
                isMuted: {
                    type: Boolean,
                    default: false, // Default to not muted
                },
                isPinned: {
                    type: Boolean,
                    default: false, // Default to not pinned
                },
            },
        ],
        lastMessage: {
            type: String,
            default: null,
        },
        lastMessageTime: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
