var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/enrollmentReport')

router.get('/', controller.enrollmentReport)
  
module.exports = router;