var express = require('express');
var router = express.Router();
const controller=require('../controller/GetWithdrawHistory')

router.get('/', controller.GetWithdrawHistory)

module.exports = router;