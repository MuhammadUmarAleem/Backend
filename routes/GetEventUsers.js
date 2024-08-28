var express = require('express');
var router = express.Router();
const controller=require('../controller/GetEventUsers')

router.get('/', controller.GetEventUsers)
  
module.exports = router;