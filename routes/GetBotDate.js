var express = require('express');
var router = express.Router();
const controller=require('../controller/GetBotDate')

router.get('/', controller.GetBotDate)

module.exports = router;