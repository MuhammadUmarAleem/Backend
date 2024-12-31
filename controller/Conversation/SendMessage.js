const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const { wss } = require('../../app'); // Import the WebSocket server instance

exports.SendMessage = async (req, res) => {
    const { conversationId, sender, content } = req.body;

    if (!conversationId || !sender || !content) {
        return res.status(400).json({ message: 'Conversation ID, sender, and content are required.' });
    }

    try {
        const message = new Message({ conversationId, sender, content });
        await message.save();

        // Update the conversation's last message
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: content,
            lastMessageTime: message.createdAt,
        });

        // Emit the new message to all connected clients in the conversation's room using WebSocket
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Check if the client has joined the conversation's room (use a custom method for room management)
                if (client.conversationId === conversationId) {
                    client.send(JSON.stringify({
                        action: 'newMessage',
                        conversationId,
                        sender,
                        content,
                        createdAt: message.createdAt,
                    }));
                }
            }
        });

        res.status(201).json({ message: 'Message sent successfully.', message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
