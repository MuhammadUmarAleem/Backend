const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const { getIO } = require('../../utils/socket'); // Import the socket instance

exports.SendMessage = async (req, res) => {
  const { conversationId, sender, content, attachment } = req.body;
  console.log(req.body);

  // Validate input
  if (!conversationId || !sender || (!content && !attachment)) {
    return res
      .status(400)
      .json({ message: 'Conversation ID, sender, and either content or attachment are required.' });
  }


  try {
    // Create and save the new message
    const messageData = { conversationId, sender, content };
    if (attachment) {
      messageData.attachment = attachment; // Include attachment if provided
    }

    const message = new Message(messageData);
    await message.save();

    // Update the conversation's last message and timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageTime: message.createdAt,
    });

    // Emit the new message to all connected clients in the conversation's room
    const io = getIO();
    io.to(conversationId).emit('newMessage', {
      conversationId,
      sender,
      content,
      attachment: message.attachment || null, // Include attachment in the event data
      createdAt: message.createdAt,
    });

    res.status(201).json({ message: 'Message sent successfully.', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
