const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/PinConversation');

// Route to send the verification email
router.put('/:conversationId', Controller.PinConversation);

module.exports = router;