var express = require('express');
var router = express.Router();
const controller=require('../controller/GetLatestWithdrawals')

router.get('/', controller.GetLatestWithdrawals)

module.exports = router;