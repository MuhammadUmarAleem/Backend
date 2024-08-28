var express = require('express');
var router = express.Router();
const controller=require('../controller/GetChat')

router.get('/', controller.GetChat)

module.exports = router;