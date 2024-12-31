const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetSellerDashboard');

// Route to send the verification email
router.get('/:sellerId', Controller.GetSellerDashboard);

module.exports = router;
