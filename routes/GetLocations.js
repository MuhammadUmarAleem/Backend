var express = require('express');
var router = express.Router();
const controller=require('../controller/GetLocations')

router.get('/', controller.GetLocations)
  
module.exports = router;