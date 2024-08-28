var express = require('express');
var router = express.Router();
const controller=require('../controller/GetMessages')

router.get('/', controller.GetMessages)
  
module.exports = router;