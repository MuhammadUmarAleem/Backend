const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/SearchConversations');

// Route to send the verification email
router.get('/:userId', Controller.SearchConversations);

module.exports = router;