const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Feedback/GetSellerFeedback');

// Route to send the verification email
router.get('/:sellerId', Controller.GetSellerFeedback);

module.exports = router;
