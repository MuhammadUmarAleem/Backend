const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/UpdateProduct');

router.put('/', Controller.UpdateProduct);

module.exports = router;
