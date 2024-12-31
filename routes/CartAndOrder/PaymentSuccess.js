const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/PaymentSuccess');

// Route to send the verification email
router.get('/', Controller.PaymentSuccess);

module.exports = router;
