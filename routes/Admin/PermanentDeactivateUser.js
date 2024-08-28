var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/PermanentDeactivateUser');


router.put('/', controller.PermanentDeactivateUser)
  
module.exports = router;