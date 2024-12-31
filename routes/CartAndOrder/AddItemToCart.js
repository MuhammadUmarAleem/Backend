const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/AddItemToCart');

// Route to send the verification email
router.post('/', Controller.AddItemToCart);

module.exports = router;
