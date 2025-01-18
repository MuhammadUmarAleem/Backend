const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetBuyerOrders');

router.get('/:buyerId', Controller.GetBuyerOrders);

module.exports = router;
