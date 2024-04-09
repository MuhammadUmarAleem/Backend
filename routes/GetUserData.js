var express = require('express');
var router = express.Router();
const controller=require('../controller/GetUserData')

router.get('/', controller.GetUserData)

module.exports = router;