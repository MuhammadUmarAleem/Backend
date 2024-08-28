var express = require('express');
var router = express.Router();
const controller=require('../controller/GetRequests')

router.get('/', controller.GetRequests)
  
module.exports = router;