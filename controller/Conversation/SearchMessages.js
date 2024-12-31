
const Message = require('../../models/Message');

exports.SearchMessages = async (req, res) => {
    const { conversationId } = req.params;
    const { searchQuery } = req.query; // Extract search query from query params

    try {
        // Fetch messages for the given conversation
        const messages = await Message.find({ conversationId })
            .populate('sender', 'email profile_Picture name') // Populate sender details
            .populate('readBy', 'email profile_Picture name'); // Populate readBy details

        // Filter messages based on the search query
        const filteredMessages = messages.filter((message) =>
            message.content?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
            message.sender.email?.toLowerCase().includes(searchQuery?.toLowerCase())
        );

        res.status(200).json({
            message: 'Messages retrieved successfully.',
            messages: filteredMessages,
        });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
