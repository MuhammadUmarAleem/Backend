var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/updateInstructor')

router.post('/', controller.updateBrand)
  
module.exports = router;