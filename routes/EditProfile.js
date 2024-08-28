var express = require('express');
var router = express.Router();
const controller=require('../controller/EditProfile');


router.post('/', controller.EditProfile)
  
module.exports = router;