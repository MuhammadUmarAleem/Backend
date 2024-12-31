const Conversation = require('../../models/Conversation');

exports.GetConversations = async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await Conversation.find({ "participants.userId": userId })
            .populate('participants.userId', 'email profile_Picture') // Populate user details
            .sort({ updatedAt: -1 });

        // Filter and format conversations for the user
        const userConversations = conversations.map((conversation) => {
            const participant = conversation.participants.find(
                (p) => p.userId._id.toString() === userId
            );
            return {
                ...conversation._doc,
                isMuted: participant?.isMuted || false,
                isPinned: participant?.isPinned || false,
            };
        });

        res.status(200).json({
            message: 'Conversations retrieved successfully.',
            conversations: userConversations,
        });
    } catch (error) {
        console.error('Error retrieving conversations:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
