const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/Withdraw');

router.post('/', Controller.Withdraw);

module.exports = router;
