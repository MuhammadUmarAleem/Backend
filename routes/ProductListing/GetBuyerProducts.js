const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetBuyerProducts');

// Route to send the verification email
router.get('/:pageno', Controller.GetBuyerProducts);

module.exports = router;
