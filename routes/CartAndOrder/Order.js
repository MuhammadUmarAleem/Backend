const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/Order');

// Route to send the verification email
router.post('/', Controller.Order);

module.exports = router;
