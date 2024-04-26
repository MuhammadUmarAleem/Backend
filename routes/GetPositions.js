var express = require('express');
var router = express.Router();
const controller=require('../controller/GetPositions')

router.get('/', controller.GetPositions)

module.exports = router;