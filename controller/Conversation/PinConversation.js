const Conversation = require('../../models/Conversation');
const { wss } = require('../../app'); // Import the WebSocket server

exports.PinConversation = async (req, res) => {
    const { conversationId } = req.params;
    const { userId } = req.body;

    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found.' });
        }

        const participant = conversation.participants.find(
            (p) => p.userId.toString() === userId
        );

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found in conversation.' });
        }

        participant.isPinned = !participant.isPinned;

        await conversation.save();

        // Emit the updated state to all clients in the conversation room
        wss.clients.forEach((client) => {
            // Check if the client is connected to the correct room
            if (client.readyState === WebSocket.OPEN && client.conversationId === conversationId) {
                client.send(JSON.stringify({
                    action: 'conversationUpdated',
                    conversationId,
                    participant,
                }));
            }
        });

        res.status(200).json({
            message: `Conversation ${participant.isPinned ? 'pinned' : 'unpinned'} successfully.`,
            participant,
        });
    } catch (error) {
        console.error('Error pinning/unpinning conversation:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};
