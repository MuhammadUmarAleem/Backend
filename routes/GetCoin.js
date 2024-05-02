var express = require('express');
var router = express.Router();
const controller=require('../controller/GetCoin')

router.get('/', controller.GetCoin)

module.exports = router;