const Message = require('../../models/Message');

exports.GetMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const messages = await Message.find({ conversationId })
            .populate('sender', 'email profile_Picture') // Populate sender details
            .populate('readBy', 'email profile_Picture'); // Populate readBy user details

        res.status(200).json({ 
            message: 'Messages retrieved successfully.', 
            messages 
        });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
