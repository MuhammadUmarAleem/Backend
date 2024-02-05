var express = require('express');
var router = express.Router();
const controller=require('../controller/GetEventDetail')

router.get('/', controller.GetEvents)
  
module.exports = router;