const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/UpdateSellerCard');

router.put('/:userId', Controller.UpdateSellerCard);

module.exports = router;
