const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/PaymentSuccess');

router.get('/', Controller.PaymentSuccess);

module.exports = router;
