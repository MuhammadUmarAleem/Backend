const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/SearchMessages');

// Route to send the verification email
router.get('/:conversationId', Controller.SearchMessages);

module.exports = router;