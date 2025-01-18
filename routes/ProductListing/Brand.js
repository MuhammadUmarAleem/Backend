const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/Brand');

router.post('/add', Controller.addBrand);
router.get('/get', Controller.getBrands);

module.exports = router;
