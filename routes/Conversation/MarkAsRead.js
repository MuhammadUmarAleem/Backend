const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/MarkAsRead');

// Route to send the verification email
router.put('/', Controller.MarkAsRead);

module.exports = router;
