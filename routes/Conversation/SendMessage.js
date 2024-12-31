const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Conversation/SendMessage');

// Route to send the verification email
router.post('/', Controller.SendMessage);

module.exports = router;
