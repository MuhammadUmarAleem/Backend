const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/StartConversation');

// Route to send the verification email
router.post('/', Controller.StartConversation);

module.exports = router;
