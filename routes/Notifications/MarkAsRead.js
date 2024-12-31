const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Notifications/MarkAsRead');

// Route to send the verification email
router.put('/:id', Controller.MarkAsRead);

module.exports = router;
