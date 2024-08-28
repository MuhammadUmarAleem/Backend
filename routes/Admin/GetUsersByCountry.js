var express = require('express');
var router = express.Router();
const controller=require('../../controller/Admin/GetUsersByCountry')

router.get('/', controller.GetUsersByCountry)
  
module.exports = router;