const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/AddProuctImages');

router.post('/', Controller.AddProductImages);

module.exports = router;
