const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetOrders');

router.get('/:sellerId', Controller.GetOrders);

module.exports = router;
