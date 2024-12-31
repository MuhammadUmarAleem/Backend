const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetCart');

// Route to send the verification email
router.get('/', Controller.GetCart);

module.exports = router;
