const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/GetCategories');

router.get('/', Controller.GetCategories);

module.exports = router;
