const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Notifications/GetNotifications');

// Route to send the verification email
router.get('/:userId', Controller.GetNotifications);

module.exports = router;
