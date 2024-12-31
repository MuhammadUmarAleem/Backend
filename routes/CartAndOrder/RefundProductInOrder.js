const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/RefundProductInOrder');

router.put('/', Controller.RefundProductInOrder);

module.exports = router;
