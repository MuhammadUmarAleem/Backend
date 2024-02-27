var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/AddInstructor');

router.post('/', controller.AddBrand)
  
module.exports = router;