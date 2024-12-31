const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Feedback/AddFeedback');

// Route to send the verification email
router.post('/', Controller.AddFeedback);

module.exports = router;
