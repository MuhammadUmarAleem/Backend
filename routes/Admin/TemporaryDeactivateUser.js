var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/TemporaryDeactivateUser');


router.put('/', controller.TemporaryDeactivateUser)
  
module.exports = router;