const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const { getIO } = require('../../utils/socket'); // Import your socket instance

exports.GetMessages = async (req, res) => {
    const { conversationId } = req.params;

    try {
        // Fetch messages for the specific conversation
        const messages = await Message.find({ conversationId })
            .populate('sender', 'email profile_Picture') // Populate sender details
            .populate('readBy', 'email profile_Picture'); // Populate readBy user details

        // Fetch conversation details to include participant info
        const conversation = await Conversation.findById(conversationId)
            .populate('participants.userId', 'email profile_Picture'); // Populate participant details

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        const io = getIO();
        // Emit the fetched messages and conversation details via socket
        io.to(conversationId).emit('messagesFetched', { messages, conversation });

        // Send back the response
        res.status(200).json({
            message: 'Messages and conversation details retrieved successfully.',
            messages,
            conversation,
        });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
