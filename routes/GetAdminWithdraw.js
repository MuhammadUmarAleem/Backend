var express = require('express');
var router = express.Router();
const controller=require('../controller/GetAdminWithdraw')

router.get('/', controller.GetAdminWithdraw)

module.exports = router;