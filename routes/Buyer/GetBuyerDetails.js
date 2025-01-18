const express = require('express');
const router = express.Router();
const Controller = require('../../controller/Buyer/GetBuyerDetails');

router.get('/:buyerId', Controller.GetBuyerDetails);

module.exports = router;
