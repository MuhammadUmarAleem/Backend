var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetInstructor')

router.get('/', controller.GetBrands)
  
module.exports = router;