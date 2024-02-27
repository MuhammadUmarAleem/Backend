var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/daywiseEnrollmentReport')

router.get('/', controller.daywiseEnrollmentReport)
  
module.exports = router;