const Message = require('../../models/Message');
const { wss } = require('../../app'); // Import the WebSocket server

exports.MarkAsRead = async (req, res) => {
    const { messageId, userId } = req.body;

    if (!messageId || !userId) {
        return res.status(400).json({ message: 'Message ID and User ID are required.' });
    }

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        // Add userId to the readBy array if not already present
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
            await message.save();

            // Notify users in the conversation room
            wss.clients.forEach((client) => {
                // Check if the client is connected to the correct room (conversationId)
                if (client.readyState === WebSocket.OPEN && client.conversationId === message.conversationId.toString()) {
                    client.send(JSON.stringify({
                        action: 'messageRead',
                        messageId,
                        userId,
                    }));
                }
            });
        }

        res.status(200).json({ message: 'Message marked as read.' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
