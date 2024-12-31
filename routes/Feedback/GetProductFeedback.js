const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Feedback/GetProductFeedback');

// Route to send the verification email
router.get('/:productId', Controller.GetProductFeedback);

module.exports = router;