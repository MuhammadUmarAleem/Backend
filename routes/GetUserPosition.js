var express = require('express');
var router = express.Router();
const controller=require('../controller/GetUserPosition')

router.get('/', controller.GetUserPosition)

module.exports = router;