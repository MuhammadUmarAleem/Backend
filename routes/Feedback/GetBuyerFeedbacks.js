const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Feedback/GetBuyerFeedbacks');

router.get('/:buyerId', Controller.GetBuyerFeedbacks);

module.exports = router;