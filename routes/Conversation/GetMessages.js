const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/GetMessages');

// Route to send the verification email
router.get('/:conversationId', Controller.GetMessages);

module.exports = router;