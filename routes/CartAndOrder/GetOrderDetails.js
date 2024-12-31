const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetOrderDetails');

router.get('/:sellerId/order/:orderId', Controller.GetOrderDetails);

module.exports = router;
