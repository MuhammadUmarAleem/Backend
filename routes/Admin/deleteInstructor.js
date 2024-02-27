var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/deleteInstructor')

router.delete('/', controller.deleteBrands)
  
module.exports = router;