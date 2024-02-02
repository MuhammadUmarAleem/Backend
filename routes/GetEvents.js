var express = require('express');
var router = express.Router();
const controller=require('../controller/GetEvents')

router.get('/', controller.GetEvents)
  
module.exports = router;