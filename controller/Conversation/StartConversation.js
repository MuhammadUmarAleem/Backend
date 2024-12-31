const { wss } = require('../../app');  // Import the WebSocket server from app.js
const Conversation = require('../../models/Conversation');

exports.StartConversation = async (req, res) => {
  const { participants } = req.body;

  if (!participants || participants.length < 2) {
    return res.status(400).json({ message: 'A conversation must have at least two participants.' });
  }

  try {
    const formattedParticipants = participants.map((userId) => ({
      userId,
      isMuted: false,
      isPinned: false,
    }));

    const existingConversation = await Conversation.findOne({
      'participants.userId': { $all: participants },
    });

    if (existingConversation) {
      return res.status(200).json({
        message: 'Conversation already exists.',
        conversation: existingConversation,
      });
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants: formattedParticipants,
    });

    await newConversation.save();

    // Notify participants via WebSocket (you can broadcast to specific participants or all clients)
    participants.forEach((userId) => {
      wss.clients.forEach((ws) => {
        if (ws.userId === userId) {
          // Send a message or join the user to the conversation room
          ws.send(JSON.stringify({
            action: 'joinRoom',
            conversationId: newConversation._id,
          }));
        }
      });
    });

    return res.status(201).json({
      message: 'Conversation started successfully.',
      conversation: newConversation,
    });
  } catch (err) {
    console.error('Error starting conversation:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
