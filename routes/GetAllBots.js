var express = require('express');
var router = express.Router();
const controller=require('../controller/GetAllBots')

router.get('/', controller.GetAllBots)

module.exports = router;