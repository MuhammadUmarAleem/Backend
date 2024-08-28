var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/ActiveTemporaryDeactivatedUser');


router.put('/', controller.ActiveTemporaryDeactivatedUser)
  
module.exports = router;