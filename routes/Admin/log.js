var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/log');

router.post('/', controller.log)
  
module.exports = router;