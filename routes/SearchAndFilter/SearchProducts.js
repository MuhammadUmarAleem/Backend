const express = require('express');
const router = express.Router();
const Controller = require('../../controller/SearchAndFilter/SearchProducts');

router.get('/', Controller.SearchProducts);

module.exports = router;
