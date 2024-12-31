const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetProducts');

// Route to send the verification email
router.get('/getProduct/:productId', Controller.GetBuyerProduct);

module.exports = router;
