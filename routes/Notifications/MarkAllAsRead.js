const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Notifications/MarkAllAsRead');

// Route to send the verification email
router.put('/:userId', Controller.MarkAllAsRead);

module.exports = router;
