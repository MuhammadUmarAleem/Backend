const express = require('express');
const router = express.Router();
const Controller = require('../../controller/ProductListing/Category');

router.post('/add', Controller.addCategory);
router.get('/get', Controller.getCategories);

module.exports = router;
