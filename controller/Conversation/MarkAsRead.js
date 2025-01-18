const { getIO } = require('../../utils/socket'); // Import the socket instance
const Message = require('../../models/Message');

exports.MarkAsRead = async (req, res) => {
    const { conversationId, userId } = req.body;

    if (!conversationId || !userId) {
        return res.status(400).json({ message: 'Conversation ID and User ID are required.' });
    }

    try {
        // Find all messages in the conversation
        const messages = await Message.find({ conversationId });

        if (!messages.length) {
            return res.status(404).json({ message: 'No messages found for this conversation.' });
        }

        // Update the readBy array for each message
        const updatePromises = messages.map(async (message) => {
            if (!message.readBy.includes(userId)) {
                message.readBy.push(userId);
                await message.save();
            }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        // Emit a socket event to notify clients
        const io = getIO();
        io.to(conversationId).emit('messagesMarkedAsRead', { conversationId, userId });

        res.status(200).json({ message: 'All messages in the conversation marked as read.' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
