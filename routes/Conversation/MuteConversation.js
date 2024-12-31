const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/MuteConversation');

// Route to send the verification email
router.put('/:conversationId', Controller.MuteConversation);

module.exports = router;