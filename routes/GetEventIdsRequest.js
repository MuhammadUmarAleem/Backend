var express = require('express');
var router = express.Router();
const controller=require('../controller/GetEventIdsRequest')

router.get('/', controller.GetEventIdsRequest)
  
module.exports = router;