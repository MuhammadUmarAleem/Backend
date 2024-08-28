var express = require('express');
var router = express.Router();
const controller=require('../controller/ChangePassword');


router.post('/', controller.ChangePassword)
  
module.exports = router;