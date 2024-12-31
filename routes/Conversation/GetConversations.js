const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/GetConversations');

// Route to send the verification email
router.get('/:userId', Controller.GetConversations);

module.exports = router;