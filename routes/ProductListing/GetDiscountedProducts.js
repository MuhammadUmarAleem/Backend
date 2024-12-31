const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetDiscountedProducts');

// Route to send the verification email
router.get('/:pageno', Controller.GetDiscountedProducts);

module.exports = router;
