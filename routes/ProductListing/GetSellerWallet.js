const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetSellerWallet');

// Route to send the verification email
router.get('/:userId', Controller.getSellerWallet);

module.exports = router;
