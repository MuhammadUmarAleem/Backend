var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetUsers')

router.get('/', controller.GetUsers)
  
module.exports = router;