const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetSellerProfile');

router.get('/:id', Controller.GetSellerProfile);

module.exports = router;
