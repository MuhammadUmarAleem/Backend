const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/DeleteItemFromCart');

// Route to send the verification email
router.delete('/', Controller.DeleteItemFromCart);

module.exports = router;
