
const Conversation = require('../../models/Conversation');

exports.SearchConversations = async (req, res) => {
    const { userId } = req.params;
    const { searchQuery } = req.query; // Extract search query from query params

    try {
        const conversations = await Conversation.find({ "participants.userId": userId })
            .populate('participants.userId', 'email profile_Picture name') // Include participant names
            .sort({ updatedAt: -1 });

        // Filter conversations based on the search query
        const filteredConversations = conversations.filter((conversation) => {
            const participantDetails = conversation.participants.map((p) => p.userId);
            return participantDetails.some((participant) =>
                participant.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
                participant.name?.toLowerCase().includes(searchQuery?.toLowerCase())
            );
        });

        // Format conversations for the user
        const userConversations = filteredConversations.map((conversation) => {
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
