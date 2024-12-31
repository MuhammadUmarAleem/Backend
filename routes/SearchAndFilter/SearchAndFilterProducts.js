const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SearchAndFilter/SearchAndFilterProducts');

router.get('/', Controller.SearchAndFilterProducts);

module.exports = router;
