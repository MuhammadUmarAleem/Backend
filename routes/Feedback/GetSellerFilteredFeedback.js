const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Feedback/GetSellerFilteredFeedback');

// Route to send the verification email
router.get('/:sellerId', Controller.GetSellerFilteredFeedback);

module.exports = router;
