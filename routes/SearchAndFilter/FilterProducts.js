const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SearchAndFilter/FilterProducts');

router.get('/', Controller.FilterProducts);

module.exports = router;
