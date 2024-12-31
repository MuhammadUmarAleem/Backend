const express = require('express');
const router = express.Router();
const Controller = require('../../controller/CartAndOrder/GetPayments');

router.get('/', Controller.GetPayments);

module.exports = router;
