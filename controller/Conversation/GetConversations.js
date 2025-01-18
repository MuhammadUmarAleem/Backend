const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');
const { getIO } = require('../../utils/socket'); // Socket.IO utility

exports.GetConversations = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all conversations for the user
        const conversations = await Conversation.find({ "participants.userId": userId })
            .populate('participants.userId', 'email profile_Picture')
            .sort({ updatedAt: -1 });

        // Enhance conversations with latest message details and unread count for both participants
        const userConversations = await Promise.all(
            conversations.map(async (conversation) => {
                // Find the latest message for the conversation
                const latestMessage = await Message.findOne({ conversationId: conversation._id })
                    .sort({ createdAt: -1 })
                    .populate('sender', 'email profile_Picture');

                const participant = conversation.participants.find(
                    (p) => p.userId._id.toString() === userId
                );

                // Find the other participant
                const otherParticipant = conversation.participants.find(
                    (p) => p.userId._id.toString() !== userId
                );

                // Check if the latest message has been read by the current user
                const isReadByUser = latestMessage?.readBy?.includes(userId);
                const isReadByOther = latestMessage?.readBy?.includes(otherParticipant.userId._id);

                // Count unread messages for the current user
                const unreadCountUser = await Message.countDocuments({
                    conversationId: conversation._id,
                    readBy: { $ne: userId }, // Not read by the current user
                });

                // Count unread messages for the other participant
                const unreadCountOther = await Message.countDocuments({
                    conversationId: conversation._id,
                    readBy: { $ne: otherParticipant.userId._id }, // Not read by the other participant
                });

                return {
                    ...conversation._doc,
                    isMuted: participant?.isMuted || false,
                    isPinned: participant?.isPinned || false,
                    latestMessage: latestMessage
                        ? {
                              content: latestMessage.content,
                              sender: latestMessage.sender.email.split('@')[0], // Extract username from email
                              readBy: latestMessage.readBy,
                              isReadByUser: isReadByUser || false,
                              isReadByOther: isReadByOther || false,
                              createdAt: latestMessage.createdAt,
                          }
                        : null,
                    unreadCountUser: {
                        userId: userId, // Current user's ID
                        count: unreadCountUser, // Count of unread messages for the current user
                    },
                    unreadCountOther: {
                        userId: otherParticipant.userId._id, // Other participant's ID
                        count: unreadCountOther, // Count of unread messages for the other participant
                    },
                };
            })
        );

        res.status(200).json({
            message: 'Conversations retrieved successfully.',
            conversations: userConversations,
        });

        // Emit updates to users in the conversation
        const io = getIO();
        io.to(userId).emit('updateConversations', userConversations);
    } catch (error) {
        console.error('Error retrieving conversations:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
