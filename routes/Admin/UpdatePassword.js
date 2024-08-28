var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/UpdatePassword');


router.put('/', controller.UpdatePassword)
  
module.exports = router;