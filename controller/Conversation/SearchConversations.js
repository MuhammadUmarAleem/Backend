const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');

exports.SearchConversations = async (req, res) => {
    const { userId } = req.params;
    const { searchQuery } = req.query; // Extract search query from query params

    try {
        // Fetch all conversations for the user
        const conversations = await Conversation.find({ "participants.userId": userId })
            .populate('participants.userId', 'email profile_Picture name') // Include participant details
            .sort({ updatedAt: -1 });

        // Filter conversations based on the search query
        const filteredConversations = conversations.filter((conversation) => {
            const participantDetails = conversation.participants.map((p) => p.userId);
            return participantDetails.some((participant) =>
                participant.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
                participant.name?.toLowerCase().includes(searchQuery?.toLowerCase())
            );
        });

        // Enhance filtered conversations with latest message details and unread count
        const userConversations = await Promise.all(
            filteredConversations.map(async (conversation) => {
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
                    readBy: { $ne: userId },
                });

                // Count unread messages for the other participant
                const unreadCountOther = await Message.countDocuments({
                    conversationId: conversation._id,
                    readBy: { $ne: otherParticipant.userId._id },
                });

                return {
                    ...conversation._doc,
                    isMuted: participant?.isMuted || false,
                    isPinned: participant?.isPinned || false,
                    latestMessage: latestMessage
                        ? {
                              content: latestMessage.content,
                              sender: latestMessage.sender.email.split('@')[0],
                              readBy: latestMessage.readBy,
                              isReadByUser: isReadByUser || false,
                              isReadByOther: isReadByOther || false,
                              createdAt: latestMessage.createdAt,
                          }
                        : null,
                    unreadCountUser: {
                        userId: userId,
                        count: unreadCountUser,
                    },
                    unreadCountOther: {
                        userId: otherParticipant.userId._id,
                        count: unreadCountOther,
                    },
                };
            })
        );

        res.status(200).json({
            message: 'Conversations retrieved successfully.',
            conversations: userConversations,
        });
    } catch (error) {
        console.error('Error retrieving conversations:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
